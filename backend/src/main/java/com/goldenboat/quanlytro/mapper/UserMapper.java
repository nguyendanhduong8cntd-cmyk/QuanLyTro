package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.user.AuthorResponse;
import com.goldenboat.quanlytro.dto.user.UserResponse;
import com.goldenboat.quanlytro.entity.User;

public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User u) {
        if (u == null) return null;
        return UserResponse.builder()
                .id(u.getId())
                .username(u.getUsername())
                .email(u.getEmail())
                .phone(u.getPhone())
                .fullName(u.getFullName())
                .avatar(u.getAvatar())
                .role(u.getRole())
                .status(u.getStatus())
                .balance(u.getBalance())
                .createdAt(u.getCreatedAt())
                .updatedAt(u.getUpdatedAt())
                .build();
    }

    public static AuthorResponse toAuthor(User u) {
        if (u == null) return null;
        return AuthorResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .phone(u.getPhone())
                .avatar(u.getAvatar())
                .build();
    }
}
