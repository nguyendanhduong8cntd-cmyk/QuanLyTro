package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.amenity.AmenityRequest;
import com.goldenboat.quanlytro.dto.amenity.AmenityResponse;
import com.goldenboat.quanlytro.service.AmenityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/amenities")
@RequiredArgsConstructor
@Tag(name = "3. Amenities", description = "Tien ich (Wifi, dieu hoa, may giat...)")
public class AmenityController {

    private final AmenityService amenityService;

    @GetMapping
    @Operation(summary = "Danh sach tat ca tien ich (cong khai)")
    public ApiResponse<List<AmenityResponse>> getAll() {
        return ApiResponse.success(amenityService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiet 1 tien ich")
    public ApiResponse<AmenityResponse> getById(@PathVariable Integer id) {
        return ApiResponse.success(amenityService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Them tien ich")
    public ResponseEntity<ApiResponse<AmenityResponse>> create(@Valid @RequestBody AmenityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Them tien ich thanh cong", amenityService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Cap nhat tien ich")
    public ApiResponse<AmenityResponse> update(@PathVariable Integer id,
                                               @Valid @RequestBody AmenityRequest request) {
        return ApiResponse.success("Cap nhat thanh cong", amenityService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Xoa tien ich")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        amenityService.delete(id);
        return ApiResponse.message("Xoa tien ich thanh cong");
    }
}
