package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Post;
import com.goldenboat.quanlytro.entity.enums.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Integer>, JpaSpecificationExecutor<Post> {

    long countByStatus(PostStatus status);

    long countByStaffId(Integer staffId);

    long countByStaffIdAndStatus(Integer staffId, PostStatus status);

    // Cac bai VIP da het han nhung van con co la VIP -> can ha xuong
    @Query("SELECT p FROM Post p WHERE p.isVip = true AND p.vipExpiration IS NOT NULL AND p.vipExpiration < :now")
    List<Post> findExpiredVipPosts(@Param("now") LocalDateTime now);
}
