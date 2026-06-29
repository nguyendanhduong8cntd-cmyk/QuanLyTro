package com.goldenboat.quanlytro.repository;

import com.goldenboat.quanlytro.entity.Transaction;
import com.goldenboat.quanlytro.entity.enums.TransactionStatus;
import com.goldenboat.quanlytro.entity.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    Page<Transaction> findByUserId(Integer userId, Pageable pageable);

    Page<Transaction> findByUserIdAndType(Integer userId, TransactionType type, Pageable pageable);

    Page<Transaction> findByType(TransactionType type, Pageable pageable);

    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);

    // Tong doanh thu (chi tinh giao dich SUCCESS)
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.status = :status AND t.type = :type")
    BigDecimal sumAmountByStatusAndType(@Param("status") TransactionStatus status, @Param("type") TransactionType type);

    @Query("""
            SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t
            WHERE t.status = :status AND t.user.id = :userId
            """)
    BigDecimal sumAmountByStatusAndUser(@Param("status") TransactionStatus status, @Param("userId") Integer userId);

    // Doanh thu theo thang trong 1 nam: tra ve [month, total]
    @Query("""
            SELECT MONTH(t.createdAt) AS month, COALESCE(SUM(t.amount), 0) AS total
            FROM Transaction t
            WHERE t.status = :status AND YEAR(t.createdAt) = :year
            GROUP BY MONTH(t.createdAt)
            ORDER BY MONTH(t.createdAt)
            """)
    List<Object[]> revenueByMonth(@Param("status") TransactionStatus status, @Param("year") int year);

    @Query("""
            SELECT MONTH(t.createdAt) AS month, COALESCE(SUM(t.amount), 0) AS total
            FROM Transaction t
            WHERE t.status = :status AND t.user.id = :userId AND YEAR(t.createdAt) = :year
            GROUP BY MONTH(t.createdAt)
            ORDER BY MONTH(t.createdAt)
            """)
    List<Object[]> revenueByMonthForUser(@Param("status") TransactionStatus status,
                                         @Param("userId") Integer userId,
                                         @Param("year") int year);
}
