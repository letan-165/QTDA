package com.app.qtda.internal.support.service;

import com.app.qtda.common.enums.SupportStatus;
import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.support.dto.request.ResponseCreateRequest;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.entity.Response;
import com.app.qtda.internal.support.entity.Support;
import com.app.qtda.internal.support.mapper.ResponseMapper;
import com.app.qtda.internal.support.mapper.SupportMapper;
import com.app.qtda.internal.support.repository.ResponseRepository;
import com.app.qtda.internal.support.repository.SupportRepository;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ResponseService {
    StaffRepository staffRepository;
    SupportRepository supportRepository;
    ResponseRepository responseRepository;
    ResponseMapper responseMapper;
    SupportMapper supportMapper;


    public SupportResponse create (ResponseCreateRequest request){
        Staff staff = staffRepository.findById(request.getStaffID())
                .orElseThrow(()-> new AppException(ErrorCode.STAFF_NO_EXISTS));

        Support support = supportRepository.findById(request.getSupportID())
                .orElseThrow(()-> new AppException(ErrorCode.SUPPORT_NO_EXISTS));

        if (!support.getStatus().equals(SupportStatus.APPROVED))
            throw new AppException(ErrorCode.SUPPORT_NO_APPROVED);

        Response response = responseMapper.toResponse(request);
        response.setStaff(staff);
        support.setResponse(response);
        support.setStatus(SupportStatus.COMPLETED);

        return supportMapper.toSupportResponse(
                supportRepository.save(support));
    }

}
