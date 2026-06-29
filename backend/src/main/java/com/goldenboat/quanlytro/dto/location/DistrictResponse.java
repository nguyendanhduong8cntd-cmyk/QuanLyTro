package com.goldenboat.quanlytro.dto.location;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DistrictResponse {

    private String id;
    private String name;
    private String provinceId;
}
