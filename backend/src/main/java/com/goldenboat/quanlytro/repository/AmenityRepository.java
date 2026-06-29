package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Integer> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Amenity> findByNameIgnoreCase(String name);
}
