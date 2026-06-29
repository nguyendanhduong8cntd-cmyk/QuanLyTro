package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.location.DistrictResponse;
import com.goldenboat.quanlytro.dto.location.ProvinceResponse;
import com.goldenboat.quanlytro.dto.location.WardResponse;
import com.goldenboat.quanlytro.entity.District;
import com.goldenboat.quanlytro.entity.Province;
import com.goldenboat.quanlytro.entity.Ward;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.LocationMapper;
import com.goldenboat.quanlytro.repository.DistrictRepository;
import com.goldenboat.quanlytro.repository.ProvinceRepository;
import com.goldenboat.quanlytro.repository.WardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Transactional(readOnly = true)
    public List<ProvinceResponse> getProvinces() {
        return provinceRepository.findAllByOrderByNameAsc().stream()
                .map(LocationMapper::toProvince)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DistrictResponse> getDistrictsByProvince(String provinceId) {
        return districtRepository.findByProvinceIdOrderByNameAsc(provinceId).stream()
                .map(LocationMapper::toDistrict)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<WardResponse> getWardsByDistrict(String districtId) {
        return wardRepository.findByDistrictIdOrderByNameAsc(districtId).stream()
                .map(LocationMapper::toWard)
                .toList();
    }

    // ===================== ADMIN: them moi don vi hanh chinh =====================

    @Transactional
    public ProvinceResponse createProvince(String id, String name) {
        if (provinceRepository.existsById(id)) {
            throw new BadRequestException("Tinh/Thanh pho voi id nay da ton tai");
        }
        Province p = Province.builder().id(id).name(name).build();
        return LocationMapper.toProvince(provinceRepository.save(p));
    }

    @Transactional
    public DistrictResponse createDistrict(String id, String name, String provinceId) {
        Province province = provinceRepository.findById(provinceId)
                .orElseThrow(() -> new ResourceNotFoundException("Tinh/Thanh pho", "id", provinceId));
        if (districtRepository.existsById(id)) {
            throw new BadRequestException("Quan/Huyen voi id nay da ton tai");
        }
        District d = District.builder().id(id).name(name).province(province).build();
        return LocationMapper.toDistrict(districtRepository.save(d));
    }

    @Transactional
    public WardResponse createWard(String id, String name, String districtId) {
        District district = districtRepository.findById(districtId)
                .orElseThrow(() -> new ResourceNotFoundException("Quan/Huyen", "id", districtId));
        if (wardRepository.existsById(id)) {
            throw new BadRequestException("Phuong/Xa voi id nay da ton tai");
        }
        Ward w = Ward.builder().id(id).name(name).district(district).build();
        return LocationMapper.toWard(wardRepository.save(w));
    }
}
