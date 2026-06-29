package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif");

    private final Path uploadPath;
    private final String urlPrefix;

    public FileStorageService(
            @Value("${app.file.upload-dir}") String uploadDir,
            @Value("${server.servlet.context-path:}") String contextPath) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.urlPrefix = contextPath + "/files/";
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(uploadPath);
            log.info("Thu muc luu tru file: {}", uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Khong the tao thu muc luu tru file", e);
        }
    }

    /**
     * Luu file va tra ve URL truy cap cong khai (vd: /api/files/abc.jpg).
     */
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File rong");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Chi chap nhan file anh (jpg, png, webp, gif)");
        }

        String original = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "file" : file.getOriginalFilename());
        if (original.contains("..")) {
            throw new BadRequestException("Ten file khong hop le");
        }

        String ext = StringUtils.getFilenameExtension(original);
        String filename = UUID.randomUUID().toString().replace("-", "")
                + (ext != null ? "." + ext.toLowerCase() : "");

        try {
            Path target = uploadPath.resolve(filename).normalize();
            if (!target.getParent().equals(uploadPath)) {
                throw new BadRequestException("Duong dan file khong hop le");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            return urlPrefix + filename;
        } catch (IOException e) {
            throw new RuntimeException("Khong the luu file " + filename, e);
        }
    }

    public List<String> storeAll(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new BadRequestException("Khong co file nao duoc tai len");
        }
        return files.stream().map(this::store).toList();
    }

    public Resource loadAsResource(String filename) {
        try {
            Path file = uploadPath.resolve(filename).normalize();
            if (!file.getParent().equals(uploadPath)) {
                throw new BadRequestException("Duong dan file khong hop le");
            }
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new ResourceNotFoundException("Khong tim thay file: " + filename);
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("Khong tim thay file: " + filename);
        }
    }
}
