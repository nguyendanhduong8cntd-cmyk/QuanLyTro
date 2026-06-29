package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.post.PostFilterRequest;
import com.goldenboat.quanlytro.entity.Amenity;
import com.goldenboat.quanlytro.entity.Post;
import com.goldenboat.quanlytro.entity.enums.PostStatus;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Xay dung dieu kien loc dong cho bai dang dua tren {@link PostFilterRequest}.
 */
public final class PostSpecifications {

    private PostSpecifications() {
    }

    public static Specification<Post> build(PostFilterRequest f, PostStatus forcedStatus, Integer forcedStaffId) {
        return (Root<Post> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Trang thai: forcedStatus uu tien (vd cong khai chi APPROVED)
            if (forcedStatus != null) {
                predicates.add(cb.equal(root.get("status"), forcedStatus));
            } else if (f.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), f.getStatus()));
            }

            if (forcedStaffId != null) {
                predicates.add(cb.equal(root.get("staff").get("id"), forcedStaffId));
            }

            if (f.getType() != null) {
                predicates.add(cb.equal(root.get("type"), f.getType()));
            }

            if (StringUtils.hasText(f.getProvinceId())) {
                predicates.add(cb.equal(root.get("province").get("id"), f.getProvinceId()));
            }
            if (StringUtils.hasText(f.getDistrictId())) {
                predicates.add(cb.equal(root.get("district").get("id"), f.getDistrictId()));
            }
            if (StringUtils.hasText(f.getWardId())) {
                predicates.add(cb.equal(root.get("ward").get("id"), f.getWardId()));
            }

            if (f.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), f.getMinPrice()));
            }
            if (f.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), f.getMaxPrice()));
            }
            if (f.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("area"), f.getMinArea()));
            }
            if (f.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("area"), f.getMaxArea()));
            }

            if (f.getIsVip() != null) {
                predicates.add(cb.equal(root.get("isVip"), f.getIsVip()));
            }

            if (StringUtils.hasText(f.getKeyword())) {
                String like = "%" + f.getKeyword().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }

            // Loc theo tien ich: bai dang phai co TAT CA tien ich duoc chon (AND nhieu EXISTS)
            if (f.getAmenityIds() != null && !f.getAmenityIds().isEmpty()) {
                for (Integer amenityId : f.getAmenityIds()) {
                    Subquery<Integer> sub = query.subquery(Integer.class);
                    Root<Post> subRoot = sub.from(Post.class);
                    Join<Post, Amenity> subJoin = subRoot.join("amenities");
                    sub.select(cb.literal(1));
                    sub.where(
                            cb.equal(subRoot.get("id"), root.get("id")),
                            cb.equal(subJoin.get("id"), amenityId)
                    );
                    predicates.add(cb.exists(sub));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
