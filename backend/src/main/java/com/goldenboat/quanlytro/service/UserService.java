package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.user.*;
import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.UserMapper;
import com.goldenboat.quanlytro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getProfile(Integer userId) {
        return UserMapper.toResponse(getUserEntity(userId));
    }

    @Transactional
    public UserResponse updateProfile(Integer userId, UpdateProfileRequest request) {
        User user = getUserEntity(userId);

        if (!user.getPhone().equals(request.getPhone())
                && userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("So dien thoai da duoc su dung");
        }

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        if (request.getAvatar() != null && !request.getAvatar().isBlank()) {
            user.setAvatar(request.getAvatar());
        }
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changePassword(Integer userId, ChangePasswordRequest request) {
        User user = getUserEntity(userId);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Mat khau hien tai khong dung");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("Mat khau moi khong duoc trung mat khau cu");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    // ===================== ADMIN =====================

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> searchUsers(String keyword, Role role, UserStatus status,
                                                  int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        String kw = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
        Page<User> result = userRepository.search(kw, role, status, pageable);
        return PageResponse.from(result, UserMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Integer id) {
        return UserMapper.toResponse(getUserEntity(id));
    }

    @Transactional
    public UserResponse createUser(AdminCreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Ten dang nhap da ton tai");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email da duoc su dung");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("So dien thoai da duoc su dung");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .role(request.getRole())
                .status(UserStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .build();
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateUserByAdmin(Integer id, AdminUpdateUserRequest request, Integer currentAdminId) {
        if (id.equals(currentAdminId)) {
            throw new BadRequestException("Khong the tu thay doi vai tro / trang thai cua chinh minh");
        }
        User user = getUserEntity(id);
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }
        return UserMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Integer id, Integer currentAdminId) {
        if (id.equals(currentAdminId)) {
            throw new BadRequestException("Khong the xoa chinh tai khoan dang dang nhap");
        }
        User user = getUserEntity(id);
        userRepository.delete(user);
    }

    // ===================== Helpers =====================

    public User getUserEntity(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", id));
    }
}
