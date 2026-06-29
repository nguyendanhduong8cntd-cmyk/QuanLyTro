package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    long countByRole(Role role);

    @Query("""
            SELECT u FROM User u
            WHERE (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
              AND (:role IS NULL OR u.role = :role)
              AND (:status IS NULL OR u.status = :status)
            """)
    Page<User> search(@Param("keyword") String keyword,
                      @Param("role") Role role,
                      @Param("status") UserStatus status,
                      Pageable pageable);
}
