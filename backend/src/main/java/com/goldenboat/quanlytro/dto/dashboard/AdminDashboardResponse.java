package com.goldenboat.quanlytro.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardResponse {

    private long totalUsers;
    private long totalStaff;
    private long totalCustomers;
    private long totalPosts;
    private long pendingPosts;
    private long approvedPosts;
    private long rejectedPosts;
    private long rentedPosts;
    private long totalAppointments;
    private BigDecimal totalRevenue;       // tong tien giao dich thanh cong
    private BigDecimal revenueFromVip;     // doanh thu tu ban goi VIP
    private BigDecimal revenueFromDeposit; // tong tien nap vao he thong
}
