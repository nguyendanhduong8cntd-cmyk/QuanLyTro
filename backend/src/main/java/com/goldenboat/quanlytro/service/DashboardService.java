package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.dashboard.AdminDashboardResponse;
import com.goldenboat.quanlytro.dto.dashboard.MonthlyRevenueResponse;
import com.goldenboat.quanlytro.dto.dashboard.StaffDashboardResponse;
import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.*;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final AppointmentRepository appointmentRepository;
    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        long totalStaff = userRepository.countByRole(Role.STAFF);
        long totalCustomers = userRepository.countByRole(Role.USER);
        long totalAdmin = userRepository.countByRole(Role.ADMIN);

        return AdminDashboardResponse.builder()
                .totalUsers(totalStaff + totalCustomers + totalAdmin)
                .totalStaff(totalStaff)
                .totalCustomers(totalCustomers)
                .totalPosts(postRepository.count())
                .pendingPosts(postRepository.countByStatus(PostStatus.PENDING))
                .approvedPosts(postRepository.countByStatus(PostStatus.APPROVED))
                .rejectedPosts(postRepository.countByStatus(PostStatus.REJECTED))
                .rentedPosts(postRepository.countByStatus(PostStatus.RENTED))
                .totalAppointments(appointmentRepository.count())
                .totalRevenue(transactionRepository.sumAmountByStatus(TransactionStatus.SUCCESS))
                .revenueFromVip(transactionRepository.sumAmountByStatusAndType(
                        TransactionStatus.SUCCESS, TransactionType.BUY_VIP))
                .revenueFromDeposit(transactionRepository.sumAmountByStatusAndType(
                        TransactionStatus.SUCCESS, TransactionType.DEPOSIT))
                .build();
    }

    @Transactional(readOnly = true)
    public StaffDashboardResponse getStaffDashboard(Integer staffId) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", staffId));

        return StaffDashboardResponse.builder()
                .myPosts(postRepository.countByStaffId(staffId))
                .myPendingPosts(postRepository.countByStaffIdAndStatus(staffId, PostStatus.PENDING))
                .myApprovedPosts(postRepository.countByStaffIdAndStatus(staffId, PostStatus.APPROVED))
                .myRejectedPosts(postRepository.countByStaffIdAndStatus(staffId, PostStatus.REJECTED))
                .myRentedPosts(postRepository.countByStaffIdAndStatus(staffId, PostStatus.RENTED))
                .myPendingAppointments(appointmentRepository.countByPostStaffIdAndStatus(
                        staffId, AppointmentStatus.PENDING))
                .myTotalAppointments(appointmentRepository.countByPostStaffIdAndStatus(
                        staffId, AppointmentStatus.PENDING)
                        + appointmentRepository.countByPostStaffIdAndStatus(staffId, AppointmentStatus.CONFIRMED)
                        + appointmentRepository.countByPostStaffIdAndStatus(staffId, AppointmentStatus.CANCELLED)
                        + appointmentRepository.countByPostStaffIdAndStatus(staffId, AppointmentStatus.DONE))
                .balance(staff.getBalance())
                .totalSpentVip(transactionRepository.sumAmountByStatusAndUser(
                        TransactionStatus.SUCCESS, staffId))
                .build();
    }

    /** Bieu do doanh thu 12 thang. Admin: toan he thong; Staff: chi tien minh da chi. */
    @Transactional(readOnly = true)
    public MonthlyRevenueResponse getRevenueChart(int year, Integer staffIdOrNull) {
        List<Object[]> rows = (staffIdOrNull == null)
                ? transactionRepository.revenueByMonth(TransactionStatus.SUCCESS, year)
                : transactionRepository.revenueByMonthForUser(TransactionStatus.SUCCESS, staffIdOrNull, year);

        List<BigDecimal> monthly = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            monthly.add(BigDecimal.ZERO);
        }

        BigDecimal total = BigDecimal.ZERO;
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();   // 1..12
            BigDecimal amount = (BigDecimal) row[1];
            if (month >= 1 && month <= 12) {
                monthly.set(month - 1, amount);
                total = total.add(amount);
            }
        }

        return MonthlyRevenueResponse.builder()
                .year(year)
                .monthlyRevenue(monthly)
                .total(total)
                .build();
    }
}
