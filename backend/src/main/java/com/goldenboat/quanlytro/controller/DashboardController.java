package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.dashboard.AdminDashboardResponse;
import com.goldenboat.quanlytro.dto.dashboard.MonthlyRevenueResponse;
import com.goldenboat.quanlytro.dto.dashboard.StaffDashboardResponse;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.security.UserPrincipal;
import com.goldenboat.quanlytro.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "9. Dashboard", description = "Thong ke & bieu do doanh thu")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Tong quan toan he thong")
    public ApiResponse<AdminDashboardResponse> adminDashboard() {
        return ApiResponse.success(dashboardService.getAdminDashboard());
    }

    @GetMapping("/staff")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @Operation(summary = "[STAFF] Tong quan cua toi")
    public ApiResponse<StaffDashboardResponse> staffDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(dashboardService.getStaffDashboard(principal.getId()));
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @Operation(summary = "Bieu do doanh thu 12 thang (ADMIN: toan he thong; STAFF: cua toi)")
    public ApiResponse<MonthlyRevenueResponse> revenueChart(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) Integer year) {
        int targetYear = (year != null) ? year : java.time.Year.now().getValue();
        Integer staffIdOrNull = (principal.getRole() == Role.ADMIN) ? null : principal.getId();
        return ApiResponse.success(dashboardService.getRevenueChart(targetYear, staffIdOrNull));
    }
}
