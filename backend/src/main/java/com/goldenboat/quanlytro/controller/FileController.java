package com.goldenboat.quanlytro.controller;

import com.goldenboat.quanlytro.dto.ApiResponse;
import com.goldenboat.quanlytro.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "8. Files", description = "Tai len & truy xuat hinh anh")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Tai len 1 anh, tra ve URL")
    public ApiResponse<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ApiResponse.success("Tai len thanh cong", Map.of("url", url));
    }

    @PostMapping(value = "/upload-multiple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Tai len nhieu anh, tra ve danh sach URL")
    public ApiResponse<Map<String, List<String>>> uploadMultiple(
            @RequestParam("files") List<MultipartFile> files) {
        List<String> urls = fileStorageService.storeAll(files);
        return ApiResponse.success("Tai len thanh cong", Map.of("urls", urls));
    }

    @GetMapping("/{filename:.+}")
    @Operation(summary = "Xem / tai anh (cong khai)")
    public ResponseEntity<Resource> serve(@PathVariable String filename, HttpServletRequest request) {
        Resource resource = fileStorageService.loadAsResource(filename);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ignored) {
            // bo qua, dung mac dinh
        }
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
