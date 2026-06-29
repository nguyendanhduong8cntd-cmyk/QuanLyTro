package com.goldenboat.quanlytro.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * Du lieu ve bieu do doanh thu theo 12 thang trong nam.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyRevenueResponse {

    private int year;
    private List<BigDecimal> monthlyRevenue; // 12 phan tu: chi so 0 = thang 1
    private BigDecimal total;
}
