package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvinceRepository extends JpaRepository<Province, String> {

    List<Province> findAllByOrderByNameAsc();
}
