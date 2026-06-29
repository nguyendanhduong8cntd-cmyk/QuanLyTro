package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.amenity.AmenityResponse;
import com.goldenboat.quanlytro.entity.Amenity;

public final class AmenityMapper {

    private AmenityMapper() {
    }

    public static AmenityResponse toResponse(Amenity a) {
        if (a == null) return null;
        return AmenityResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .icon(a.getIcon())
                .build();
    }
}
