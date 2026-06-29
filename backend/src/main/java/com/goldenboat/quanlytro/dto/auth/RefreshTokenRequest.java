package com.goldenboat.quanlytro.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token khong duoc de trong")
    private String refreshToken;
}
