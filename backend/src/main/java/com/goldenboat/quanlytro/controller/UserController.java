package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.user.*;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import com.goldenboat.quanlytro.security.UserPrincipal;
import com.goldenboat.quanlytro.service.UserService;
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
@RequestMapping("/users")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "2. Users", description = "Ho so ca nhan & quan ly nguoi dung (ADMIN)")
public class UserController {

    private final UserService userService;

    // ===================== Ho so ca nhan =====================

    @GetMapping("/me")
    @Operation(summary = "Lay thong tin tai khoan dang dang nhap")
    public ApiResponse<UserResponse> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(userService.getProfile(principal.getId()));
    }

    @PutMapping("/me")
    @Operation(summary = "Cap nhat ho so ca nhan")
    public ApiResponse<UserResponse> updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                     @Valid @RequestBody UpdateProfileRequest request) {
        return ApiResponse.success("Cap nhat ho so thanh cong",
                userService.updateProfile(principal.getId(), request));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Doi mat khau")
    public ApiResponse<Void> changePassword(@AuthenticationPrincipal UserPrincipal principal,
                                            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return ApiResponse.message("Doi mat khau thanh cong");
    }

    // ===================== Quan ly nguoi dung (ADMIN) =====================

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Danh sach / tim kiem nguoi dung")
    public ApiResponse<PageResponse<UserResponse>> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(userService.searchUsers(keyword, role, status, page, size));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Xem chi tiet 1 nguoi dung")
    public ApiResponse<UserResponse> getUser(@PathVariable Integer id) {
        return ApiResponse.success(userService.getUserById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Tao tai khoan moi (vd: STAFF)")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tao tai khoan thanh cong", userService.createUser(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Cap nhat vai tro / trang thai (khoa-mo) tai khoan")
    public ApiResponse<UserResponse> updateUser(@PathVariable Integer id,
                                                @Valid @RequestBody AdminUpdateUserRequest request,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Cap nhat tai khoan thanh cong",
                userService.updateUserByAdmin(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Xoa tai khoan")
    public ApiResponse<Void> deleteUser(@PathVariable Integer id,
                                        @AuthenticationPrincipal UserPrincipal principal) {
        userService.deleteUser(id, principal.getId());
        return ApiResponse.message("Xoa tai khoan thanh cong");
    }
}
