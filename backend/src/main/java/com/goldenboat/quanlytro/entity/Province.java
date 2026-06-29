package com.goldenboat.quanlytro.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "provinces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Province {

    @Id
    @Column(length = 20)
    private String id;

    @Column(nullable = false, length = 100)
    private String name;
}
