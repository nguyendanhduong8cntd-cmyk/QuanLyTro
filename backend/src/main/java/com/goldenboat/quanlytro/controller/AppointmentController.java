package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.appointment.AppointmentRequest;
import com.goldenboat.quanlytro.dto.appointment.AppointmentResponse;
import com.goldenboat.quanlytro.dto.appointment.UpdateAppointmentStatusRequest;
import com.goldenboat.quanlytro.entity.enums.AppointmentStatus;
import com.goldenboat.quanlytro.security.UserPrincipal;
import com.goldenboat.quanlytro.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "6. Appointments", description = "Dat lich xem phong")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Dat lich xem phong")
    public ResponseEntity<ApiResponse<AppointmentResponse>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dat lich thanh cong",
                        appointmentService.create(principal.getId(), request)));
    }

    @GetMapping("/my")
    @Operation(summary = "Danh sach lich hen cua toi (khach dat)")
    public ApiResponse<PageResponse<AppointmentResponse>> myAppointments(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(
                appointmentService.getMyAppointments(principal.getId(), status, page, size));
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @Operation(summary = "[STAFF] Lich hen cho cac bai dang cua toi")
    public ApiResponse<PageResponse<AppointmentResponse>> staffAppointments(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(
                appointmentService.getAppointmentsForStaff(principal.getId(), status, page, size));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Tat ca lich hen")
    public ApiResponse<PageResponse<AppointmentResponse>> allAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(appointmentService.getAllForAdmin(page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiet lich hen")
    public ApiResponse<AppointmentResponse> getById(@PathVariable Integer id,
                                                    @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(appointmentService.getById(id, principal));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cap nhat trang thai (chu bai: xac nhan/huy/hoan thanh; khach: chi huy)")
    public ApiResponse<AppointmentResponse> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Cap nhat trang thai thanh cong",
                appointmentService.updateStatus(id, request.getStatus(), principal));
    }
}
