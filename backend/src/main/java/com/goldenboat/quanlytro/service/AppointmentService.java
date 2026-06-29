package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.appointment.AppointmentRequest;
import com.goldenboat.quanlytro.dto.appointment.AppointmentResponse;
import com.goldenboat.quanlytro.entity.Appointment;
import com.goldenboat.quanlytro.entity.Post;
import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.AppointmentStatus;
import com.goldenboat.quanlytro.entity.enums.PostStatus;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ForbiddenException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.AppointmentMapper;
import com.goldenboat.quanlytro.repository.AppointmentRepository;
import com.goldenboat.quanlytro.repository.PostRepository;
import com.goldenboat.quanlytro.repository.UserRepository;
import com.goldenboat.quanlytro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse create(Integer userId, AppointmentRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Bai dang", "id", request.getPostId()));

        if (post.getStatus() != PostStatus.APPROVED) {
            throw new BadRequestException("Chi co the dat lich xem voi bai dang da duoc duyet");
        }
        if (post.getStaff() != null && post.getStaff().getId().equals(userId)) {
            throw new BadRequestException("Ban khong the dat lich xem chinh bai dang cua minh");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", userId));

        Appointment appointment = Appointment.builder()
                .user(user)
                .post(post)
                .appointmentDate(request.getAppointmentDate())
                .note(request.getNote())
                .status(AppointmentStatus.PENDING)
                .build();

        return AppointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getMyAppointments(Integer userId, AppointmentStatus status,
                                                               int page, int size) {
        Pageable pageable = defaultPageable(page, size);
        Page<Appointment> result = (status == null)
                ? appointmentRepository.findByUserId(userId, pageable)
                : appointmentRepository.findByUserIdAndStatus(userId, status, pageable);
        return PageResponse.from(result, AppointmentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getAppointmentsForStaff(Integer staffId, AppointmentStatus status,
                                                                     int page, int size) {
        Pageable pageable = defaultPageable(page, size);
        Page<Appointment> result = (status == null)
                ? appointmentRepository.findByPostStaffId(staffId, pageable)
                : appointmentRepository.findByPostStaffIdAndStatus(staffId, status, pageable);
        return PageResponse.from(result, AppointmentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentResponse> getAllForAdmin(int page, int size) {
        Page<Appointment> result = appointmentRepository.findAll(defaultPageable(page, size));
        return PageResponse.from(result, AppointmentMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getById(Integer id, UserPrincipal principal) {
        Appointment appointment = findEntity(id);
        if (!canView(appointment, principal)) {
            throw new ForbiddenException("Ban khong co quyen xem lich hen nay");
        }
        return AppointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse updateStatus(Integer id, AppointmentStatus newStatus, UserPrincipal principal) {
        Appointment appointment = findEntity(id);

        boolean isCustomer = appointment.getUser() != null
                && appointment.getUser().getId().equals(principal.getId());
        boolean isManager = principal.getRole() == Role.ADMIN
                || (appointment.getPost() != null && appointment.getPost().getStaff() != null
                && appointment.getPost().getStaff().getId().equals(principal.getId()));

        if (isManager) {
            // Quan ly (admin / chu bai dang) duoc cap nhat moi trang thai
            appointment.setStatus(newStatus);
        } else if (isCustomer) {
            // Khach chi duoc tu huy lich cua minh
            if (newStatus != AppointmentStatus.CANCELLED) {
                throw new ForbiddenException("Ban chi co the huy lich hen cua minh");
            }
            appointment.setStatus(AppointmentStatus.CANCELLED);
        } else {
            throw new ForbiddenException("Ban khong co quyen cap nhat lich hen nay");
        }

        return AppointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    private boolean canView(Appointment a, UserPrincipal principal) {
        if (principal.getRole() == Role.ADMIN) return true;
        boolean isCustomer = a.getUser() != null && a.getUser().getId().equals(principal.getId());
        boolean isOwnerStaff = a.getPost() != null && a.getPost().getStaff() != null
                && a.getPost().getStaff().getId().equals(principal.getId());
        return isCustomer || isOwnerStaff;
    }

    private Appointment findEntity(Integer id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lich hen", "id", id));
    }

    private Pageable defaultPageable(int page, int size) {
        return PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)),
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
