package com.goldenboat.quanlytro.dto.post;

import com.goldenboat.quanlytro.entity.enums.PostStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Thong tin rut gon cua bai dang (dung trong lich hen).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostBriefResponse {

    private Integer id;
    private String title;
    private String addressDetail;
    private BigDecimal price;
    private String thumbnail;
    private PostStatus status;
}
