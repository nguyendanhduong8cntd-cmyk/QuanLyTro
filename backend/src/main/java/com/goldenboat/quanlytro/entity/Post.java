package com.goldenboat.quanlytro.entity;

import com.goldenboat.quanlytro.entity.enums.PostStatus;
import com.goldenboat.quanlytro.entity.enums.PostType;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal area;

    @Column(name = "address_detail", nullable = false)
    private String addressDetail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "province_id")
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private User staff;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private PostStatus status = PostStatus.PENDING;

    @Column(name = "is_vip", nullable = false)
    @Builder.Default
    private Boolean isVip = false;

    @Column(name = "vip_expiration")
    private LocalDateTime vipExpiration;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "post_amenities",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    @Builder.Default
    private Set<Amenity> amenities = new HashSet<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private Set<PostImage> images = new LinkedHashSet<>();

    // Helper: dong bo quan he 2 chieu khi them anh
    public void addImage(PostImage image) {
        images.add(image);
        image.setPost(this);
    }

    public void clearImages() {
        for (PostImage img : new LinkedHashSet<>(images)) {
            img.setPost(null);
        }
        images.clear();
    }
}
