package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.location.DistrictResponse;
import com.goldenboat.quanlytro.dto.location.ProvinceResponse;
import com.goldenboat.quanlytro.dto.location.WardResponse;
import com.goldenboat.quanlytro.entity.District;
import com.goldenboat.quanlytro.entity.Province;
import com.goldenboat.quanlytro.entity.Ward;

public final class LocationMapper {

    private LocationMapper() {
    }

    public static ProvinceResponse toProvince(Province p) {
        if (p == null) return null;
        return ProvinceResponse.builder().id(p.getId()).name(p.getName()).build();
    }

    public static DistrictResponse toDistrict(District d) {
        if (d == null) return null;
        return DistrictResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .provinceId(d.getProvince() != null ? d.getProvince().getId() : null)
                .build();
    }

    public static WardResponse toWard(Ward w) {
        if (w == null) return null;
        return WardResponse.builder()
                .id(w.getId())
                .name(w.getName())
                .districtId(w.getDistrict() != null ? w.getDistrict().getId() : null)
                .build();
    }
}
