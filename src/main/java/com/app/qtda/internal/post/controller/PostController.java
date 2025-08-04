package com.app.qtda.internal.post.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.post.dto.request.DeletePostRequest;
import com.app.qtda.internal.post.dto.request.ListPostSaveRequest;
import com.app.qtda.internal.post.dto.request.PostSaveRequest;
import com.app.qtda.internal.post.dto.response.PostResponse;
import com.app.qtda.internal.post.service.PostService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/post")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PostController {
    PostService postService;

    @GetMapping("/public/gets/notifications")
    public ApiResponse<List<PostResponse>> getNotifications() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getNotifications())
                .build();
    }

    @GetMapping("/public/gets/events")
    public ApiResponse<List<PostResponse>> getEvents() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getEvents())
                .build();
    }

    @GetMapping("/public/gets/scholarships")
    public ApiResponse<List<PostResponse>> getScholarships() {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.getScholarships())
                .build();
    }

    @PostMapping("/public/saves")
    public ApiResponse<List<PostResponse>> saves(@RequestBody ListPostSaveRequest request) {
        return ApiResponse.<List<PostResponse>>builder()
                .result(postService.saves(request))
                .build();
    }

    @DeleteMapping("/public/removes")
    public ApiResponse<List<Long>> delete(@RequestBody DeletePostRequest request) {
        return ApiResponse.<List<Long>>builder()
                .result(postService.deletes(request.getNotificationIDs()))
                .build();
    }
}
