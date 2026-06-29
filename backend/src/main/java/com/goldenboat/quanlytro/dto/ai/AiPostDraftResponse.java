package com.goldenboat.quanlytro.dto.ai;

import com.goldenboat.quanlytro.dto.location.DistrictResponse;
import com.goldenboat.quanlytro.dto.location.ProvinceResponse;
import com.goldenboat.quanlytro.dto.location.WardResponse;
import com.goldenboat.quanlytro.entity.enums.PostType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Ban nhap tin dang do AI de xuat, dung de dien san vao form. Staff van ra soat va chinh sua.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiPostDraftResponse {

    private String title;
    private String description;
    private BigDecimal price;
    private BigDecimal area;
    private String addressDetail;
    private PostType type;

    // Da khop voi du lieu trong he thong (co the null neu khong khop)
    private ProvinceResponse province;
    private DistrictResponse district;
    private WardResponse ward;
    private List<Integer> amenityIds;

    // Nhung gia tri AI doc duoc nhung KHONG khop duoc trong he thong -> de FE canh bao
    private List<String> unmatched;

    private String note;
}
