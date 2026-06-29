package com.goldenboat.quanlytro.security;

import com.goldenboat.quanlytro.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Tien ich lay thong tin nguoi dung dang dang nhap tu SecurityContext.
 */
public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static UserPrincipal getCurrentPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            throw new UnauthorizedException("Chua dang nhap");
        }
        return principal;
    }

    public static Integer getCurrentUserId() {
        return getCurrentPrincipal().getId();
    }

    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof UserPrincipal;
    }
}
