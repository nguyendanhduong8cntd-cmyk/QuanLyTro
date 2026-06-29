package com.goldenboat.quanlytro.dto.ai;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AiExtractRequest {

    @NotBlank(message = "Vui long dan noi dung tin dang")
    @Size(max = 8000, message = "Noi dung qua dai (toi da 8000 ky tu)")
    private String text;
}
