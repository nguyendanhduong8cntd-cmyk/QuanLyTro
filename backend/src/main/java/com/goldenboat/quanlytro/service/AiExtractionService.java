package com.goldenboat.quanlytro.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import com.goldenboat.quanlytro.dto.ai.AiPostDraftResponse;
import com.goldenboat.quanlytro.entity.Amenity;
import com.goldenboat.quanlytro.entity.District;
import com.goldenboat.quanlytro.entity.Province;
import com.goldenboat.quanlytro.entity.Ward;
import com.goldenboat.quanlytro.entity.enums.PostType;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.mapper.LocationMapper;
import com.goldenboat.quanlytro.repository.AmenityRepository;
import com.goldenboat.quanlytro.repository.DistrictRepository;
import com.goldenboat.quanlytro.repository.ProvinceRepository;
import com.goldenboat.quanlytro.repository.WardRepository;
import com.goldenboat.quanlytro.service.ai.AiListingExtraction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AiExtractionService {

    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final AmenityRepository amenityRepository;

    private final boolean enabled;
    private final String model;
    private final long maxTokens;
    private final AnthropicClient client;

    public AiExtractionService(ProvinceRepository provinceRepository,
                               DistrictRepository districtRepository,
                               WardRepository wardRepository,
                               AmenityRepository amenityRepository,
                               @Value("${app.ai.anthropic-api-key:}") String apiKey,
                               @Value("${app.ai.model:claude-opus-4-8}") String model,
                               @Value("${app.ai.max-tokens:4096}") long maxTokens) {
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
        this.amenityRepository = amenityRepository;
        this.model = model;
        this.maxTokens = maxTokens;
        this.enabled = StringUtils.hasText(apiKey);
        this.client = enabled
                ? AnthropicOkHttpClient.builder().apiKey(apiKey).build()
                : null;
        if (!enabled) {
            log.warn("Tinh nang AI tat (chua dat ANTHROPIC_API_KEY).");
        }
    }

    @Transactional(readOnly = true)
    public AiPostDraftResponse extract(String text) {
        if (!enabled) {
            throw new BadRequestException(
                    "Tinh nang 'Dang tin nhanh bang AI' chua duoc cau hinh. "
                            + "Vui long dat bien moi truong ANTHROPIC_API_KEY cho backend.");
        }

        List<Amenity> amenities = amenityRepository.findAll();
        List<Province> provinces = provinceRepository.findAll();

        AiListingExtraction extracted = callClaude(text, amenities, provinces);

        List<String> unmatched = new ArrayList<>();
        AiPostDraftResponse.AiPostDraftResponseBuilder draft = AiPostDraftResponse.builder()
                .title(blankToNull(extracted.title()))
                .description(blankToNull(extracted.description()))
                .addressDetail(blankToNull(extracted.addressDetail()))
                .price(toMoney(extracted.price()))
                .area(toArea(extracted.area()))
                .type(parseType(extracted.type()));

        // --- Khop dia diem ---
        Province province = findMatch(provinces, Province::getName, extracted.provinceName());
        if (province != null) {
            draft.province(LocationMapper.toProvince(province));
            List<District> districts = districtRepository.findByProvinceIdOrderByNameAsc(province.getId());
            District district = findMatch(districts, District::getName, extracted.districtName());
            if (district != null) {
                draft.district(LocationMapper.toDistrict(district));
                List<Ward> wards = wardRepository.findByDistrictIdOrderByNameAsc(district.getId());
                Ward ward = findMatch(wards, Ward::getName, extracted.wardName());
                if (ward != null) {
                    draft.ward(LocationMapper.toWard(ward));
                } else if (StringUtils.hasText(extracted.wardName())) {
                    unmatched.add("Phuong/Xa: " + extracted.wardName());
                }
            } else if (StringUtils.hasText(extracted.districtName())) {
                unmatched.add("Quan/Huyen: " + extracted.districtName());
            }
        } else if (StringUtils.hasText(extracted.provinceName())) {
            unmatched.add("Tinh/Thanh pho: " + extracted.provinceName());
        }

        // --- Khop tien ich ---
        List<Integer> amenityIds = new ArrayList<>();
        if (extracted.amenityNames() != null) {
            for (String name : extracted.amenityNames()) {
                Amenity a = findMatch(amenities, Amenity::getName, name);
                if (a != null) {
                    if (!amenityIds.contains(a.getId())) amenityIds.add(a.getId());
                } else if (StringUtils.hasText(name)) {
                    unmatched.add("Tien ich: " + name);
                }
            }
        }
        draft.amenityIds(amenityIds);
        draft.unmatched(unmatched.isEmpty() ? null : unmatched);
        draft.note(unmatched.isEmpty()
                ? "AI da phan tich xong. Vui long ra soat lai truoc khi dang."
                : "AI da phan tich xong. Mot so muc chua khop he thong, vui long chon lai thu cong.");

        return draft.build();
    }

    private AiListingExtraction callClaude(String text, List<Amenity> amenities, List<Province> provinces) {
        String amenityList = amenities.stream().map(Amenity::getName).collect(Collectors.joining(", "));
        String provinceList = provinces.stream().map(Province::getName).collect(Collectors.joining(", "));

        String prompt = """
                Ban la tro ly trich xuat thong tin tin dang phong tro o Viet Nam.
                Tu doan van ban duoi day, hay trich xuat thong tin theo dung cau truc yeu cau.

                QUY TAC QUAN TRONG:
                - title va description: viet bang tieng Viet CO DAU, gon gang, lich su.
                - price: quy doi gia thue moi thang ra so VND nguyen. Vi du: "2tr5" -> 2500000; "3 trieu" -> 3000000; "800k" -> 800000.
                - area: dien tich theo m2 (chi lay so).
                - type: chi chon MOT trong: PHONG_TRO, NGUYEN_CAN, CHUNG_CU_MINI, O_GHEP.
                - amenityNames: CHI duoc chon tu danh sach tien ich hop le sau: [%s]. Khong tu bia them tien ich ngoai danh sach.
                - provinceName: neu phu hop, uu tien dung dung ten trong danh sach: [%s].
                - addressDetail: chi gom so nha / ten duong / ngo hem, KHONG kem phuong/quan/tinh.
                - Truong nao khong xac dinh duoc thi de chuoi rong, rieng price/area de 0.

                --- NOI DUNG TIN DANG ---
                %s
                """.formatted(amenityList, provinceList, text);

        StructuredMessageCreateParams<AiListingExtraction> params = MessageCreateParams.builder()
                .model(model)
                .maxTokens(maxTokens)
                .outputConfig(AiListingExtraction.class)
                .addUserMessage(prompt)
                .build();

        try {
            return client.messages().create(params).content().stream()
                    .flatMap(block -> block.text().stream())
                    .map(structured -> structured.text())
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("AI khong tra ve du lieu hop le"));
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Loi goi Claude API", e);
            throw new BadRequestException("Khong the phan tich bang AI: " + e.getMessage());
        }
    }

    // ===================== Helpers =====================

    private <T> T findMatch(List<T> items, Function<T, String> nameGetter, String aiName) {
        String target = normalize(aiName);
        if (target.isBlank()) return null;
        T contains = null;
        for (T item : items) {
            String n = normalize(nameGetter.apply(item));
            if (n.isBlank()) continue;
            if (n.equals(target)) return item; // uu tien khop chinh xac
            if (contains == null && (n.contains(target) || target.contains(n))) {
                contains = item;
            }
        }
        return contains;
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String n = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
        n = n.toLowerCase()
                .replace('đ', 'd')
                .replaceAll("\\b(thanh pho|tinh|quan|huyen|phuong|xa|thi xa|thi tran|tp)\\b", " ")
                .replaceAll("[^a-z0-9]", " ")
                .replaceAll("\\s+", " ")
                .trim();
        return n;
    }

    private static String blankToNull(String s) {
        return StringUtils.hasText(s) ? s.trim() : null;
    }

    private static BigDecimal toMoney(Double v) {
        if (v == null || v <= 0) return null;
        return BigDecimal.valueOf(v).setScale(0, RoundingMode.HALF_UP);
    }

    private static BigDecimal toArea(Double v) {
        if (v == null || v <= 0) return null;
        return BigDecimal.valueOf(v).setScale(2, RoundingMode.HALF_UP);
    }

    private static PostType parseType(String t) {
        if (!StringUtils.hasText(t)) return null;
        try {
            return PostType.valueOf(t.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
