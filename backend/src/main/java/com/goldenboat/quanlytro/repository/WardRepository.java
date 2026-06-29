package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WardRepository extends JpaRepository<Ward, String> {

    List<Ward> findByDistrictIdOrderByNameAsc(String districtId);
}
