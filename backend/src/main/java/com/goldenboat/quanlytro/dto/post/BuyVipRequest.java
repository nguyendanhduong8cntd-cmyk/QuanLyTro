package com.goldenboat.quanlytro.dto.post;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Mua/gia han goi VIP day bai len top. Tru tien tu vi cua STAFF.
 */
@Data
public class BuyVipRequest {

    @NotNull(message = "Vui long nhap so ngay")
    @Min(value = 1, message = "Toi thieu 1 ngay")
    @Max(value = 365, message = "Toi da 365 ngay")
    private Integer days;
}
