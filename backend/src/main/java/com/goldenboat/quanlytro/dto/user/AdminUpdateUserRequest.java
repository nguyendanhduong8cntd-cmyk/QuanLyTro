package com.goldenboat.quanlytro.dto.user;

import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import lombok.Data;

/**
 * Admin cap nhat vai tro / trang thai tai khoan. Cac truong null se khong bi thay doi.
 */
@Data
public class AdminUpdateUserRequest {

    private Role role;
    private UserStatus status;
}
