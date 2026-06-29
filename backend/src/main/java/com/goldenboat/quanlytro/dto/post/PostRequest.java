package com.goldenboat.quanlytro.dto.post;

import com.goldenboat.quanlytro.entity.enums.PostType;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class PostRequest {

    @NotBlank(message = "Tieu de khong duoc de trong")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Mo ta khong duoc de trong")
    private String description;

    @NotNull(message = "Gia thue khong duoc de trong")
    @DecimalMin(value = "0", inclusive = false, message = "Gia thue phai lon hon 0")
    private BigDecimal price;

    @NotNull(message = "Dien tich khong duoc de trong")
    @DecimalMin(value = "0", inclusive = false, message = "Dien tich phai lon hon 0")
    private BigDecimal area;

    @NotBlank(message = "Dia chi chi tiet khong duoc de trong")
    @Size(max = 255)
    private String addressDetail;

    @NotNull(message = "Vui long chon loai hinh")
    private PostType type;

    @NotBlank(message = "Vui long chon Tinh/Thanh pho")
    private String provinceId;

    @NotBlank(message = "Vui long chon Quan/Huyen")
    private String districtId;

    @NotBlank(message = "Vui long chon Phuong/Xa")
    private String wardId;

    /** Danh sach id tien ich di kem. */
    private Set<Integer> amenityIds;

    /** Danh sach URL anh (tai len truoc qua /files/upload). */
    private List<String> imageUrls;
}
