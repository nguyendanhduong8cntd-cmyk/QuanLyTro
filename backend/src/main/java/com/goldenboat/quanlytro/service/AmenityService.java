package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.amenity.AmenityRequest;
import com.goldenboat.quanlytro.dto.amenity.AmenityResponse;
import com.goldenboat.quanlytro.entity.Amenity;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.AmenityMapper;
import com.goldenboat.quanlytro.repository.AmenityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;

    @Transactional(readOnly = true)
    public List<AmenityResponse> getAll() {
        return amenityRepository.findAll(Sort.by("id")).stream()
                .map(AmenityMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AmenityResponse getById(Integer id) {
        return AmenityMapper.toResponse(getEntity(id));
    }

    @Transactional
    public AmenityResponse create(AmenityRequest request) {
        if (amenityRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Tien ich da ton tai: " + request.getName());
        }
        Amenity amenity = Amenity.builder()
                .name(request.getName())
                .icon(request.getIcon())
                .build();
        return AmenityMapper.toResponse(amenityRepository.save(amenity));
    }

    @Transactional
    public AmenityResponse update(Integer id, AmenityRequest request) {
        Amenity amenity = getEntity(id);
        if (!amenity.getName().equalsIgnoreCase(request.getName())
                && amenityRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Tien ich da ton tai: " + request.getName());
        }
        amenity.setName(request.getName());
        amenity.setIcon(request.getIcon());
        return AmenityMapper.toResponse(amenityRepository.save(amenity));
    }

    @Transactional
    public void delete(Integer id) {
        Amenity amenity = getEntity(id);
        amenityRepository.delete(amenity);
    }

    private Amenity getEntity(Integer id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tien ich", "id", id));
    }
}
