package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.transaction.TransactionResponse;
import com.goldenboat.quanlytro.dto.user.DepositRequest;
import com.goldenboat.quanlytro.entity.enums.TransactionType;
import com.goldenboat.quanlytro.security.UserPrincipal;
import com.goldenboat.quanlytro.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "7. Transactions", description = "Vi tien & giao dich (nap tien, mua VIP...)")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/deposit")
    @Operation(summary = "Nap tien vao vi (gia lap thanh toan VNPAY/MOMO)")
    public ApiResponse<TransactionResponse> deposit(@AuthenticationPrincipal UserPrincipal principal,
                                                    @Valid @RequestBody DepositRequest request) {
        return ApiResponse.success("Nap tien thanh cong",
                transactionService.deposit(principal.getId(), request));
    }

    @GetMapping("/my")
    @Operation(summary = "Lich su giao dich cua toi")
    public ApiResponse<PageResponse<TransactionResponse>> myTransactions(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(
                transactionService.getMyTransactions(principal.getId(), type, page, size));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "[ADMIN] Tat ca giao dich toan he thong")
    public ApiResponse<PageResponse<TransactionResponse>> allTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(transactionService.getAllForAdmin(type, page, size));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Chi tiet giao dich")
    public ApiResponse<TransactionResponse> getById(@PathVariable Integer id,
                                                    @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(transactionService.getById(id, principal));
    }
}
