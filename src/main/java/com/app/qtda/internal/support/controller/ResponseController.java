package com.app.qtda.internal.support.controller;

import com.app.qtda.common.ApiResponse;
import com.app.qtda.internal.support.dto.request.ResponseCreateRequest;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.service.ResponseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/response")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ResponseController {
    ResponseService responseService;

    @PostMapping("/public/create")
    ApiResponse<SupportResponse> create(@RequestBody ResponseCreateRequest request){
        return ApiResponse.<SupportResponse>builder()
                .result(responseService.create(request))
                .build();
    }
}
