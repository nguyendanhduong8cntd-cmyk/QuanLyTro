package com.goldenboat.quanlytro.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Ten dang nhap khong duoc de trong")
    @Size(min = 4, max = 50, message = "Ten dang nhap tu 4 den 50 ky tu")
    private String username;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 6, max = 100, message = "Mat khau toi thieu 6 ky tu")
    private String password;

    @NotBlank(message = "Email khong duoc de trong")
    @Email(message = "Email khong hop le")
    @Size(max = 100)
    private String email;

    @NotBlank(message = "So dien thoai khong duoc de trong")
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "So dien thoai khong hop le")
    private String phone;

    @NotBlank(message = "Ho ten khong duoc de trong")
    @Size(max = 100)
    private String fullName;
}
