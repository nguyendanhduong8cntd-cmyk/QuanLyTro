package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.auth.AuthResponse;
import com.goldenboat.quanlytro.dto.auth.LoginRequest;
import com.goldenboat.quanlytro.dto.auth.RefreshTokenRequest;
import com.goldenboat.quanlytro.dto.auth.RegisterRequest;
import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.exception.UnauthorizedException;
import com.goldenboat.quanlytro.mapper.UserMapper;
import com.goldenboat.quanlytro.repository.UserRepository;
import com.goldenboat.quanlytro.security.JwtTokenProvider;
import com.goldenboat.quanlytro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
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
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .build();

        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(), request.getPassword()));

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay tai khoan"));

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        if (!tokenProvider.validateToken(refreshToken)
                || !"REFRESH".equals(tokenProvider.getTokenType(refreshToken))) {
            throw new UnauthorizedException("Refresh token khong hop le hoac da het han");
        }

        Integer userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay tai khoan"));

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new UnauthorizedException("Tai khoan da bi khoa");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getAccessTokenExpirationMs())
                .user(UserMapper.toResponse(user))
                .build();
    }
}
