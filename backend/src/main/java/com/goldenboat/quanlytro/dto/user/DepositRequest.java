package com.goldenboat.quanlytro.dto.user;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Nap tien vao vi (gia lap thanh toan VNPAY/MOMO...).
 */
@Data
public class DepositRequest {

    @NotNull(message = "Vui long nhap so tien")
    @DecimalMin(value = "1000", message = "So tien nap toi thieu la 1.000d")
    private BigDecimal amount;

    private String paymentMethod; // VNPAY, MOMO, BANK_TRANSFER ... (mac dinh VNPAY)
}
