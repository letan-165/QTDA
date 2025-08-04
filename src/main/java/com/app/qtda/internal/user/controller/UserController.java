package com.app.qtda.internal.user.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.user.dto.request.ListUserSaveRequest;
import com.app.qtda.internal.user.dto.request.UserDeleteRequest;
import com.app.qtda.internal.user.dto.response.UserResponse;
import com.app.qtda.internal.user.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping("/public/gets")
    ApiResponse<List<UserResponse>> findAll(){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.findAll())
                .build();
    }

    @PostMapping("/public/saves")
    ApiResponse<List<UserResponse>>save(@RequestBody ListUserSaveRequest request){
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.save(request.getUsers()))
                .build();
    }

    @DeleteMapping("/public/removes")
    ApiResponse<List<String>>delete(@RequestBody UserDeleteRequest request){
        return ApiResponse.<List<String>>builder()
                .result(userService.delete(request.getUserIDs()))
                .build();
    }

}