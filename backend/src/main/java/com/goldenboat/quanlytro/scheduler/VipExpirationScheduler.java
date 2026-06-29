package com.goldenboat.quanlytro.scheduler;

import com.goldenboat.quanlytro.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Dinh ky ha cac bai dang VIP da het han xuong thuong.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class VipExpirationScheduler {

    private final PostService postService;

    // Chay luc 00:05 moi ngay
    @Scheduled(cron = "0 5 0 * * *")
    public void downgradeExpiredVip() {
        try {
            int count = postService.downgradeExpiredVipPosts();
            if (count > 0) {
                log.info("[Scheduler] Da ha {} bai VIP het han", count);
            }
        } catch (Exception e) {
            log.error("[Scheduler] Loi khi xu ly VIP het han", e);
        }
    }
}
