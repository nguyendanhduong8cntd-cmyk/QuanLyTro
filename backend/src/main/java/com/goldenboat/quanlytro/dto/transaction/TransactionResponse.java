package com.goldenboat.quanlytro.dto.transaction;

import com.goldenboat.quanlytro.entity.enums.TransactionStatus;
import com.goldenboat.quanlytro.entity.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Integer id;
    private Integer userId;
    private String userFullName;
    private BigDecimal amount;
    private TransactionType type;
    private String paymentMethod;
    private TransactionStatus status;
    private String description;
    private LocalDateTime createdAt;
}
