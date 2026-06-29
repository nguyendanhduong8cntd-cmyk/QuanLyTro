package com.goldenboat.quanlytro.mapper;

import com.goldenboat.quanlytro.dto.transaction.TransactionResponse;
import com.goldenboat.quanlytro.entity.Transaction;

public final class TransactionMapper {

    private TransactionMapper() {
    }

    public static TransactionResponse toResponse(Transaction t) {
        if (t == null) return null;
        return TransactionResponse.builder()
                .id(t.getId())
                .userId(t.getUser() != null ? t.getUser().getId() : null)
                .userFullName(t.getUser() != null ? t.getUser().getFullName() : null)
                .amount(t.getAmount())
                .type(t.getType())
                .paymentMethod(t.getPaymentMethod())
                .status(t.getStatus())
                .description(t.getDescription())
                .createdAt(t.getCreatedAt())
                .build();
    }
}
