package com.goldenboat.quanlytro.dto.post;

import com.goldenboat.quanlytro.dto.amenity.AmenityResponse;
import com.goldenboat.quanlytro.dto.location.DistrictResponse;
import com.goldenboat.quanlytro.dto.location.ProvinceResponse;
import com.goldenboat.quanlytro.dto.location.WardResponse;
import com.goldenboat.quanlytro.dto.user.AuthorResponse;
import com.goldenboat.quanlytro.entity.enums.PostStatus;
import com.goldenboat.quanlytro.entity.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {

    private Integer id;
    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal area;
    private String addressDetail;
    private PostType type;

    private ProvinceResponse province;
    private DistrictResponse district;
    private WardResponse ward;
    private AuthorResponse staff;

    private PostStatus status;
    private Boolean isVip;
    private LocalDateTime vipExpiration;

    private List<AmenityResponse> amenities;
    private List<String> images;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
