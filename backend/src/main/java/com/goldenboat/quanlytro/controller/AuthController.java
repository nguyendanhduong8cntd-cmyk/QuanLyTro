package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.auth.AuthResponse;
import com.goldenboat.quanlytro.dto.auth.LoginRequest;
import com.goldenboat.quanlytro.dto.auth.RefreshTokenRequest;
import com.goldenboat.quanlytro.dto.auth.RegisterRequest;
import com.goldenboat.quanlytro.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "1. Authentication", description = "Dang ky, dang nhap, lam moi token")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Dang ky tai khoan moi (vai tro USER)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dang ky thanh cong", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Dang nhap bang username hoac email")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Dang nhap thanh cong", response));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Lam moi access token bang refresh token")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Lam moi token thanh cong", response));
    }
}
