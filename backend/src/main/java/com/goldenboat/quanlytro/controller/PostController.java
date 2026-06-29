package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.ai.AiExtractRequest;
import com.goldenboat.quanlytro.dto.ai.AiPostDraftResponse;
import com.goldenboat.quanlytro.dto.post.*;
import com.goldenboat.quanlytro.security.UserPrincipal;
import com.goldenboat.quanlytro.service.AiExtractionService;
import com.goldenboat.quanlytro.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
@Tag(name = "5. Posts", description = "Bai dang phong tro: dang tin, tim kiem, kiem duyet, VIP")
public class PostController {

    private final PostService postService;
    private final AiExtractionService aiExtractionService;

    // ===================== Dang tin nhanh bang AI =====================

    @PostMapping("/ai-extract")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Dan van ban tin dang -> AI trich xuat va dien san form")
    public ApiResponse<AiPostDraftResponse> aiExtract(@Valid @RequestBody AiExtractRequest request) {
        return ApiResponse.success("Phan tich thanh cong", aiExtractionService.extract(request.getText()));
    }

    // ===================== Cong khai =====================

    @GetMapping
    @Operation(summary = "Tim kiem / loc phong tro (cong khai, chi bai da duyet)")
    public ApiResponse<PageResponse<PostResponse>> search(@ModelAttribute PostFilterRequest filter) {
        return ApiResponse.success(postService.searchPublic(filter));
    }

    @GetMapping("/{id:\\d+}")
    @Operation(summary = "Chi tiet 1 bai dang")
    public ApiResponse<PostResponse> getById(@PathVariable Integer id,
                                             @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(postService.getById(id, principal));
    }

    // ===================== STAFF / ADMIN: quan ly bai dang =====================

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Danh sach bai dang cua toi")
    public ApiResponse<PageResponse<PostResponse>> myPosts(@AuthenticationPrincipal UserPrincipal principal,
                                                           @ModelAttribute PostFilterRequest filter) {
        return ApiResponse.success(postService.getMyPosts(principal.getId(), filter));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[ADMIN] Danh sach tat ca bai dang (loc moi trang thai)")
    public ApiResponse<PageResponse<PostResponse>> adminSearch(@ModelAttribute PostFilterRequest filter) {
        return ApiResponse.success(postService.searchForAdmin(filter));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Dang bai moi (mac dinh trang thai PENDING cho duyet)")
    public ResponseEntity<ApiResponse<PostResponse>> create(@AuthenticationPrincipal UserPrincipal principal,
                                                            @Valid @RequestBody PostRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Dang bai thanh cong, vui long cho duyet",
                        postService.create(principal.getId(), request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Sua bai dang (staff sua se can duyet lai)")
    public ApiResponse<PostResponse> update(@PathVariable Integer id,
                                            @Valid @RequestBody PostRequest request,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Cap nhat bai dang thanh cong",
                postService.update(id, request, principal));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Xoa bai dang")
    public ApiResponse<Void> delete(@PathVariable Integer id,
                                    @AuthenticationPrincipal UserPrincipal principal) {
        postService.delete(id, principal);
        return ApiResponse.message("Xoa bai dang thanh cong");
    }

    @PatchMapping("/{id}/rented")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Danh dau da cho thue")
    public ApiResponse<PostResponse> markRented(@PathVariable Integer id,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success("Da cap nhat trang thai", postService.markRented(id, principal));
    }

    @PostMapping("/{id}/vip")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[STAFF] Mua/gia han goi VIP (tru tien tu vi)")
    public ApiResponse<PostResponse> buyVip(@PathVariable Integer id,
                                            @AuthenticationPrincipal UserPrincipal principal,
                                            @Valid @RequestBody BuyVipRequest request) {
        return ApiResponse.success("Mua goi VIP thanh cong",
                postService.buyVip(id, principal.getId(), request));
    }

    // ===================== ADMIN: kiem duyet =====================

    @PatchMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[ADMIN] Duyet bai dang")
    public ApiResponse<PostResponse> approve(@PathVariable Integer id) {
        return ApiResponse.success("Da duyet bai dang", postService.approve(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "[ADMIN] Tu choi bai dang")
    public ApiResponse<PostResponse> reject(@PathVariable Integer id,
                                            @Valid @RequestBody RejectRequest request) {
        return ApiResponse.success("Da tu choi bai dang", postService.reject(id, request.getReason()));
    }
}
