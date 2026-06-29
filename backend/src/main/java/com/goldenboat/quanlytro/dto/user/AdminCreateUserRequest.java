package com.goldenboat.quanlytro.dto.user;

import com.goldenboat.quanlytro.entity.enums.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Admin tao tai khoan (vd: tao tai khoan STAFF).
 */
@Data
public class AdminCreateUserRequest {

    @NotBlank(message = "Ten dang nhap khong duoc de trong")
    @Size(min = 4, max = 50)
    private String username;

    @NotBlank(message = "Mat khau khong duoc de trong")
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    @Email(message = "Email khong hop le")
    private String email;

    @NotBlank
    @Pattern(regexp = "^(0|\\+84)\\d{9,10}$", message = "So dien thoai khong hop le")
    private String phone;

    @NotBlank
    private String fullName;

    @NotNull(message = "Vui long chon vai tro")
    private Role role;
}
