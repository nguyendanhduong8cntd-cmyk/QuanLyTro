package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.amenity.AmenityResponse;
import com.goldenboat.quanlytro.dto.post.PostBriefResponse;
import com.goldenboat.quanlytro.dto.post.PostResponse;
import com.goldenboat.quanlytro.entity.Post;
import com.goldenboat.quanlytro.entity.PostImage;

import java.util.Comparator;
import java.util.List;

public final class PostMapper {

    private PostMapper() {
    }

    public static PostResponse toResponse(Post p) {
        if (p == null) return null;

        List<String> images = p.getImages().stream()
                .sorted(Comparator.comparing(PostImage::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(PostImage::getImageUrl)
                .toList();

        List<AmenityResponse> amenities = p.getAmenities().stream()
                .map(AmenityMapper::toResponse)
                .sorted(Comparator.comparing(AmenityResponse::getId))
                .toList();

        return PostResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .price(p.getPrice())
                .area(p.getArea())
                .addressDetail(p.getAddressDetail())
                .type(p.getType())
                .province(LocationMapper.toProvince(p.getProvince()))
                .district(LocationMapper.toDistrict(p.getDistrict()))
                .ward(LocationMapper.toWard(p.getWard()))
                .staff(UserMapper.toAuthor(p.getStaff()))
                .status(p.getStatus())
                .isVip(p.getIsVip())
                .vipExpiration(p.getVipExpiration())
                .amenities(amenities)
                .images(images)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public static PostBriefResponse toBrief(Post p) {
        if (p == null) return null;
        String thumbnail = p.getImages().stream()
                .sorted(Comparator.comparing(PostImage::getId, Comparator.nullsLast(Comparator.naturalOrder())))
                .map(PostImage::getImageUrl)
                .findFirst()
                .orElse(null);

        return PostBriefResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .addressDetail(p.getAddressDetail())
                .price(p.getPrice())
                .thumbnail(thumbnail)
                .status(p.getStatus())
                .build();
    }
}
