package com.goldenboat.quanlytro.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "district_id")
    private District district;
}
