package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.location.DistrictResponse;
import com.goldenboat.quanlytro.dto.location.ProvinceResponse;
import com.goldenboat.quanlytro.dto.location.WardResponse;
import com.goldenboat.quanlytro.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
@Tag(name = "4. Locations", description = "Don vi hanh chinh: Tinh / Quan-Huyen / Phuong-Xa")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/provinces")
    @Operation(summary = "Danh sach Tinh/Thanh pho")
    public ApiResponse<List<ProvinceResponse>> getProvinces() {
        return ApiResponse.success(locationService.getProvinces());
    }

    @GetMapping("/provinces/{provinceId}/districts")
    @Operation(summary = "Danh sach Quan/Huyen theo Tinh")
    public ApiResponse<List<DistrictResponse>> getDistricts(@PathVariable String provinceId) {
        return ApiResponse.success(locationService.getDistrictsByProvince(provinceId));
    }

    @GetMapping("/districts/{districtId}/wards")
    @Operation(summary = "Danh sach Phuong/Xa theo Quan/Huyen")
    public ApiResponse<List<WardResponse>> getWards(@PathVariable String districtId) {
        return ApiResponse.success(locationService.getWardsByDistrict(districtId));
    }

    // ===================== ADMIN them moi =====================

    @PostMapping("/provinces")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Them Tinh/Thanh pho")
    public ResponseEntity<ApiResponse<ProvinceResponse>> createProvince(@RequestBody LocationItem body) {
        ProvinceResponse res = locationService.createProvince(body.getId(), body.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Da them", res));
    }

    @PostMapping("/districts")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Them Quan/Huyen")
    public ResponseEntity<ApiResponse<DistrictResponse>> createDistrict(@RequestBody LocationItem body) {
        DistrictResponse res = locationService.createDistrict(body.getId(), body.getName(), body.getParentId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Da them", res));
    }

    @PostMapping("/wards")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Them Phuong/Xa")
    public ResponseEntity<ApiResponse<WardResponse>> createWard(@RequestBody LocationItem body) {
        WardResponse res = locationService.createWard(body.getId(), body.getName(), body.getParentId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Da them", res));
    }

    @Data
    public static class LocationItem {
        private String id;
        private String name;
        private String parentId; // provinceId cho district, districtId cho ward
    }
}
