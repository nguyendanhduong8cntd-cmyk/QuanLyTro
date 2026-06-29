package com.goldenboat.quanlytro.dto.amenity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AmenityRequest {

    @NotBlank(message = "Ten tien ich khong duoc de trong")
    @Size(max = 100)
    private String name;

    @Size(max = 50)
    private String icon;
}
