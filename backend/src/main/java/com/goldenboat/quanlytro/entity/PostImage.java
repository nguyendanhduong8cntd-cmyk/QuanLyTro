package com.goldenboat.quanlytro.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;
}
