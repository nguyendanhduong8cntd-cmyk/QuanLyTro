package com.goldenboat.quanlytro.security;

import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Khong tim thay tai khoan: " + usernameOrEmail));
        return UserPrincipal.from(user);
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Khong tim thay tai khoan id: " + id));
        return UserPrincipal.from(user);
    }
}
