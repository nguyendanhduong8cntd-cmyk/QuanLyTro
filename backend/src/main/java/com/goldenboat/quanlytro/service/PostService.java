package com.goldenboat.quanlytro.service;

import com.goldenboat.quanlytro.dto.PageResponse;
import com.goldenboat.quanlytro.dto.post.BuyVipRequest;
import com.goldenboat.quanlytro.dto.post.PostFilterRequest;
import com.goldenboat.quanlytro.dto.post.PostRequest;
import com.goldenboat.quanlytro.dto.post.PostResponse;
import com.goldenboat.quanlytro.entity.*;
import com.goldenboat.quanlytro.entity.enums.PostStatus;
import com.goldenboat.quanlytro.entity.enums.Role;
import com.goldenboat.quanlytro.entity.enums.TransactionStatus;
import com.goldenboat.quanlytro.entity.enums.TransactionType;
import com.goldenboat.quanlytro.exception.BadRequestException;
import com.goldenboat.quanlytro.exception.ForbiddenException;
import com.goldenboat.quanlytro.exception.ResourceNotFoundException;
import com.goldenboat.quanlytro.mapper.PostMapper;
import com.goldenboat.quanlytro.repository.*;
import com.goldenboat.quanlytro.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    /** Don gia goi VIP cho moi ngay (VND). */
    private static final BigDecimal VIP_PRICE_PER_DAY = new BigDecimal("10000");
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "price", "area");

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;
    private final AmenityRepository amenityRepository;
    private final TransactionRepository transactionRepository;

    // ===================== TIM KIEM / XEM =====================

    /** Tim kiem cong khai: chi tra ve bai da duyet (APPROVED), uu tien VIP len dau. */
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> searchPublic(PostFilterRequest filter) {
        Specification<Post> spec = PostSpecifications.build(filter, PostStatus.APPROVED, null);
        Page<Post> page = postRepository.findAll(spec, buildPageable(filter, true));
        return PageResponse.from(page, PostMapper::toResponse);
    }

    /** Admin xem/loc tat ca bai dang theo trang thai tuy y. */
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> searchForAdmin(PostFilterRequest filter) {
        Specification<Post> spec = PostSpecifications.build(filter, null, null);
        Page<Post> page = postRepository.findAll(spec, buildPageable(filter, false));
        return PageResponse.from(page, PostMapper::toResponse);
    }

    /** Staff xem danh sach bai dang cua chinh minh. */
    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getMyPosts(Integer staffId, PostFilterRequest filter) {
        Specification<Post> spec = PostSpecifications.build(filter, null, staffId);
        Page<Post> page = postRepository.findAll(spec, buildPageable(filter, false));
        return PageResponse.from(page, PostMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PostResponse getById(Integer id, UserPrincipal principal) {
        Post post = findEntity(id);
        if (post.getStatus() != PostStatus.APPROVED && !canManage(post, principal)) {
            throw new ResourceNotFoundException("Bai dang", "id", id);
        }
        return PostMapper.toResponse(post);
    }

    // ===================== TAO / SUA / XOA =====================

    @Transactional
    public PostResponse create(Integer staffId, PostRequest request) {
        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", staffId));

        Post post = Post.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .area(request.getArea())
                .addressDetail(request.getAddressDetail())
                .type(request.getType())
                .staff(staff)
                .status(PostStatus.PENDING)
                .isVip(false)
                .build();

        applyLocation(post, request);
        applyAmenities(post, request.getAmenityIds());
        applyImages(post, request.getImageUrls());

        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse update(Integer id, PostRequest request, UserPrincipal principal) {
        Post post = findEntity(id);
        if (!canManage(post, principal)) {
            throw new ForbiddenException("Ban khong co quyen sua bai dang nay");
        }

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setPrice(request.getPrice());
        post.setArea(request.getArea());
        post.setAddressDetail(request.getAddressDetail());
        post.setType(request.getType());
        applyLocation(post, request);
        applyAmenities(post, request.getAmenityIds());

        post.clearImages();
        applyImages(post, request.getImageUrls());

        // Staff sua bai -> can duyet lai. Admin sua thi giu nguyen trang thai.
        if (principal.getRole() == Role.STAFF && post.getStatus() != PostStatus.RENTED) {
            post.setStatus(PostStatus.PENDING);
        }

        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public void delete(Integer id, UserPrincipal principal) {
        Post post = findEntity(id);
        if (!canManage(post, principal)) {
            throw new ForbiddenException("Ban khong co quyen xoa bai dang nay");
        }
        postRepository.delete(post);
    }

    // ===================== KIEM DUYET (ADMIN) =====================

    @Transactional
    public PostResponse approve(Integer id) {
        Post post = findEntity(id);
        post.setStatus(PostStatus.APPROVED);
        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse reject(Integer id, String reason) {
        Post post = findEntity(id);
        post.setStatus(PostStatus.REJECTED);
        log.info("Bai dang #{} bi tu choi. Ly do: {}", id, reason);
        return PostMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse markRented(Integer id, UserPrincipal principal) {
        Post post = findEntity(id);
        if (!canManage(post, principal)) {
            throw new ForbiddenException("Ban khong co quyen cap nhat bai dang nay");
        }
        post.setStatus(PostStatus.RENTED);
        return PostMapper.toResponse(postRepository.save(post));
    }

    // ===================== MUA GOI VIP =====================

    @Transactional
    public PostResponse buyVip(Integer id, Integer staffId, BuyVipRequest request) {
        Post post = findEntity(id);
        if (post.getStaff() == null || !post.getStaff().getId().equals(staffId)) {
            throw new ForbiddenException("Ban chi co the mua VIP cho bai dang cua minh");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Nguoi dung", "id", staffId));

        BigDecimal cost = VIP_PRICE_PER_DAY.multiply(BigDecimal.valueOf(request.getDays()));
        if (staff.getBalance().compareTo(cost) < 0) {
            throw new BadRequestException("So du vi khong du. Can " + cost
                    + "d nhung chi co " + staff.getBalance() + "d. Vui long nap them tien.");
        }

        // Tru tien vi
        staff.setBalance(staff.getBalance().subtract(cost));
        userRepository.save(staff);

        // Gia han VIP: neu con han thi cong don, neu het han thi tinh tu bay gio
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime base = (Boolean.TRUE.equals(post.getIsVip())
                && post.getVipExpiration() != null
                && post.getVipExpiration().isAfter(now))
                ? post.getVipExpiration() : now;
        post.setVipExpiration(base.plusDays(request.getDays()));
        post.setIsVip(true);
        postRepository.save(post);

        // Ghi nhan giao dich
        Transaction txn = Transaction.builder()
                .user(staff)
                .amount(cost)
                .type(TransactionType.BUY_VIP)
                .paymentMethod("WALLET")
                .status(TransactionStatus.SUCCESS)
                .description("Mua goi VIP " + request.getDays() + " ngay cho bai dang #" + post.getId())
                .build();
        transactionRepository.save(txn);

        return PostMapper.toResponse(post);
    }

    /** Ha cac bai VIP da het han xuong thuong. */
    @Transactional
    public int downgradeExpiredVipPosts() {
        List<Post> expired = postRepository.findExpiredVipPosts(LocalDateTime.now());
        for (Post p : expired) {
            p.setIsVip(false);
        }
        if (!expired.isEmpty()) {
            postRepository.saveAll(expired);
            log.info("Da ha {} bai VIP het han xuong thuong", expired.size());
        }
        return expired.size();
    }

    // ===================== HELPERS =====================

    public Post findEntity(Integer id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bai dang", "id", id));
    }

    private boolean canManage(Post post, UserPrincipal principal) {
        if (principal == null) return false;
        if (principal.getRole() == Role.ADMIN) return true;
        return post.getStaff() != null && post.getStaff().getId().equals(principal.getId());
    }

    private void applyLocation(Post post, PostRequest request) {
        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new ResourceNotFoundException("Tinh/Thanh pho", "id", request.getProvinceId()));
        District district = districtRepository.findById(request.getDistrictId())
                .orElseThrow(() -> new ResourceNotFoundException("Quan/Huyen", "id", request.getDistrictId()));
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new ResourceNotFoundException("Phuong/Xa", "id", request.getWardId()));

        if (district.getProvince() == null || !district.getProvince().getId().equals(province.getId())) {
            throw new BadRequestException("Quan/Huyen khong thuoc Tinh/Thanh pho da chon");
        }
        if (ward.getDistrict() == null || !ward.getDistrict().getId().equals(district.getId())) {
            throw new BadRequestException("Phuong/Xa khong thuoc Quan/Huyen da chon");
        }

        post.setProvince(province);
        post.setDistrict(district);
        post.setWard(ward);
    }

    private void applyAmenities(Post post, Set<Integer> amenityIds) {
        post.getAmenities().clear();
        if (amenityIds != null && !amenityIds.isEmpty()) {
            List<Amenity> found = amenityRepository.findAllById(amenityIds);
            if (found.size() != amenityIds.size()) {
                throw new BadRequestException("Mot hoac nhieu tien ich khong ton tai");
            }
            post.setAmenities(new HashSet<>(found));
        }
    }

    private void applyImages(Post post, List<String> imageUrls) {
        if (imageUrls != null) {
            for (String url : imageUrls) {
                if (url != null && !url.isBlank()) {
                    post.addImage(PostImage.builder().imageUrl(url.trim()).build());
                }
            }
        }
    }

    private Pageable buildPageable(PostFilterRequest filter, boolean vipFirst) {
        int page = filter.getPage() == null ? 0 : Math.max(0, filter.getPage());
        int size = filter.getSize() == null ? 12 : Math.min(100, Math.max(1, filter.getSize()));

        String sortBy = ALLOWED_SORT_FIELDS.contains(filter.getSortBy()) ? filter.getSortBy() : "createdAt";
        Sort.Direction dir = "asc".equalsIgnoreCase(filter.getSortDir())
                ? Sort.Direction.ASC : Sort.Direction.DESC;

        Sort sort = Sort.by(dir, sortBy);
        if (vipFirst) {
            // VIP len dau, sau do moi den tieu chi sap xep da chon
            sort = Sort.by(Sort.Order.desc("isVip")).and(sort);
        }
        return PageRequest.of(page, size, sort);
    }
}
