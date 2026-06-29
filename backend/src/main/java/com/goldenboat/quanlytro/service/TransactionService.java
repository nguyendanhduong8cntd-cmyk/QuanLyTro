package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.transaction.TransactionResponse;
import com.goldenboat.quanlytro.dto.user.DepositRequest;
import com.goldenboat.quanlytro.entity.Transaction;
import com.goldenboat.quanlytro.entity.User;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.TransactionStatus;
import com.goldenboat.quanlytro.entity.enums.TransactionType;
import com.goldenboat.quanlytro.exception.ForbiddenException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.TransactionMapper;
import com.goldenboat.quanlytro.repository.TransactionRepository;
import com.goldenboat.quanlytro.repository.UserRepository;
import com.goldenboat.quanlytro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final List<String> ALLOWED_METHODS = List.of("VNPAY", "MOMO", "BANK_TRANSFER");

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    /**
     * Nap tien vao vi (gia lap thanh toan thanh cong ngay). Trong thuc te se tao giao dich
     * PENDING roi cho cong thanh toan (VNPAY/MOMO) callback ve de chuyen sang SUCCESS.
     */
    @Transactional
    public TransactionResponse deposit(Integer userId, DepositRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", userId));

        String method = (request.getPaymentMethod() != null
                && ALLOWED_METHODS.contains(request.getPaymentMethod().toUpperCase()))
                ? request.getPaymentMethod().toUpperCase() : "VNPAY";

        // Cong tien vao vi
        user.setBalance(user.getBalance().add(request.getAmount()));
        userRepository.save(user);

        Transaction txn = Transaction.builder()
                .user(user)
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .paymentMethod(method)
                .status(TransactionStatus.SUCCESS)
                .description("Nap " + request.getAmount() + "d vao vi qua " + method)
                .build();

        return TransactionMapper.toResponse(transactionRepository.save(txn));
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getMyTransactions(Integer userId, TransactionType type,
                                                               int page, int size) {
        Pageable pageable = defaultPageable(page, size);
        Page<Transaction> result = (type == null)
                ? transactionRepository.findByUserId(userId, pageable)
                : transactionRepository.findByUserIdAndType(userId, type, pageable);
        return PageResponse.from(result, TransactionMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PageResponse<TransactionResponse> getAllForAdmin(TransactionType type, int page, int size) {
        Pageable pageable = defaultPageable(page, size);
        Page<Transaction> result = (type == null)
                ? transactionRepository.findAll(pageable)
                : transactionRepository.findByType(type, pageable);
        return PageResponse.from(result, TransactionMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Integer id, UserPrincipal principal) {
        Transaction txn = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Giao dich", "id", id));
        boolean isOwner = txn.getUser() != null && txn.getUser().getId().equals(principal.getId());
        if (principal.getRole() != Role.ADMIN && !isOwner) {
            throw new ForbiddenException("Ban khong co quyen xem giao dich nay");
        }
        return TransactionMapper.toResponse(txn);
    }

    private Pageable defaultPageable(int page, int size) {
        return PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)),
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
