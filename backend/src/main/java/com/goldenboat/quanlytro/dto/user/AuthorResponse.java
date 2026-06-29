package com.goldenboat.quanlytro.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Thong tin rut gon cua nguoi dang tin (hien thi cong khai).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorResponse {

    private Integer id;
    private String fullName;
    private String phone;
    private String avatar;
}
