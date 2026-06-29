package com.goldenboat.quanlytro.service.ai;

import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

/**
 * Cau truc du lieu Claude tra ve (structured output) khi trich xuat tin dang tu van ban.
 * Cac mo ta (@JsonPropertyDescription) duoc dua vao JSON Schema gui cho model.
 */
public record AiListingExtraction(

        @JsonPropertyDescription("Tieu de ngan gon, hap dan cho tin dang (tieng Viet co dau). Tu tao neu van ban khong co tieu de ro rang.")
        String title,

        @JsonPropertyDescription("Mo ta chi tiet ve phong, da duoc viet lai gon gang, sach se (tieng Viet co dau).")
        String description,

        @JsonPropertyDescription("Gia thue moi thang, quy doi ra so VND. Vi du: '2tr5' -> 2500000; '3 trieu' -> 3000000; '800k' -> 800000. Neu khong ro, de 0.")
        Double price,

        @JsonPropertyDescription("Dien tich phong tinh bang met vuong (m2). Neu khong ro, de 0.")
        Double area,

        @JsonPropertyDescription("Dia chi chi tiet: so nha, ten duong, ngo/hem. KHONG bao gom ten phuong/quan/tinh.")
        String addressDetail,

        @JsonPropertyDescription("Loai hinh, chi duoc chon MOT trong: PHONG_TRO (phong tro), NGUYEN_CAN (nha nguyen can), CHUNG_CU_MINI (chung cu mini), O_GHEP (o ghep).")
        String type,

        @JsonPropertyDescription("Ten Tinh/Thanh pho (vi du: 'Ha Noi', 'Ho Chi Minh', 'Da Nang'). De trong neu khong xac dinh duoc.")
        String provinceName,

        @JsonPropertyDescription("Ten Quan/Huyen (vi du: 'Cau Giay', 'Binh Thanh'). De trong neu khong xac dinh duoc.")
        String districtName,

        @JsonPropertyDescription("Ten Phuong/Xa. De trong neu khong xac dinh duoc.")
        String wardName,

        @JsonPropertyDescription("Danh sach ten tien ich, CHI chon tu danh sach tien ich hop le da cung cap trong yeu cau. Khong co thi de mang rong.")
        List<String> amenityNames
) {
}
