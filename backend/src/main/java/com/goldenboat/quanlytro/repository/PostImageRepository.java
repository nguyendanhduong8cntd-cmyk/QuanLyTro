package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Integer> {
}
