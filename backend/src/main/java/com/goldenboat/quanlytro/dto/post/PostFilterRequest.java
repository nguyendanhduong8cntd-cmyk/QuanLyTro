package com.goldenboat.quanlytro.dto.post;

import com.goldenboat.quanlytro.entity.enums.PostStatus;
import com.goldenboat.quanlytro.entity.enums.PostType;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * Bo loc tim kiem phong tro. Tat ca deu khong bat buoc.
 */
@Data
public class PostFilterRequest {

    private String keyword;          // tim trong tieu de / mo ta
    private PostType type;
    private String provinceId;
    private String districtId;
    private String wardId;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private BigDecimal minArea;
    private BigDecimal maxArea;
    private List<Integer> amenityIds; // phai co tat ca cac tien ich nay
    private Boolean isVip;
    private PostStatus status;        // chi ADMIN/STAFF moi loc theo trang thai; cong khai mac dinh APPROVED

    // Phan trang & sap xep
    private Integer page = 0;
    private Integer size = 12;
    private String sortBy = "createdAt";   // createdAt | price | area
    private String sortDir = "desc";       // asc | desc
}
