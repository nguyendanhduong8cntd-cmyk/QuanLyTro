package com.goldenboat.quanlytro.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StaffDashboardResponse {

    private long myPosts;
    private long myPendingPosts;
    private long myApprovedPosts;
    private long myRejectedPosts;
    private long myRentedPosts;
    private long myPendingAppointments;
    private long myTotalAppointments;
    private BigDecimal balance;        // so du vi hien tai
    private BigDecimal totalSpentVip;  // tong tien da chi cho VIP
}
