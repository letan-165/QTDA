package com.app.qtda.internal.support.service;

import com.app.qtda.common.enums.SupportStatus;
import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.support.dto.request.SupportCreateRequest;
import com.app.qtda.internal.support.dto.request.SupportStateRequest;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.entity.Support;
import com.app.qtda.internal.support.entity.SupportType;
import com.app.qtda.internal.support.mapper.SupportMapper;
import com.app.qtda.internal.support.repository.SupportRepository;
import com.app.qtda.internal.support.repository.SupportTypeRepository;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.repository.StudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SupportService {
    SupportRepository supportRepository;
    StudentRepository studentRepository;
    SupportTypeRepository supportTypeRepository;
    SupportMapper supportMapper;

    public List<SupportResponse>getAll(){
        var list = supportRepository.findAll();
        return list.stream().map(supportMapper::toSupportResponse)
                .toList();
    }

    public List<SupportResponse>getAllStatus(SupportStateRequest request){
        var list = supportRepository.findAll();
        return list.stream()
                .filter(support -> support.getStatus().equals(request.getStatus()))
                .map(supportMapper::toSupportResponse)
                .toList();
    }

    public List<SupportResponse>getByStudent(String studentID){
        var list = supportRepository.findAll();
        return list.stream()
                .filter(support -> support.getStudent().getStudentID().equals(studentID))
                .map(supportMapper::toSupportResponse)
                .toList();
    }

    public SupportResponse create(SupportCreateRequest request){
        Student student = studentRepository.findById(request.getStudentID())
                .orElseThrow(()-> new AppException(ErrorCode.STUDENT_NO_EXISTS));

        SupportType supportType = supportTypeRepository.findById(request.getSupportTypeID())
                .orElseThrow(() -> new AppException(ErrorCode.SUPPORT_TYPE_NO_EXISTS));

        Support support = supportMapper.toSupport(request);
        support.setStatus(SupportStatus.PENDING);
        support.setStudent(student);
        support.setSupportType(supportType);

        return supportMapper.toSupportResponse(
                supportRepository.save(support));
    }

    public SupportResponse findByID(Long supportID) {
        Support support = supportRepository.findById(supportID)
                .orElseThrow(()-> new AppException(ErrorCode.SUPPORT_NO_EXISTS));

        return supportMapper.toSupportResponse(support);
    }

    public SupportResponse confirmState(Long supportID, SupportStateRequest request){
        Support support = supportRepository.findById(supportID)
                .orElseThrow(()-> new AppException(ErrorCode.SUPPORT_NO_EXISTS));

        if(support.getStatus().equals(SupportStatus.CANCELLED))
            throw new AppException(ErrorCode.SUPPORT_CANCELLED);

        if(support.getStatus().equals(SupportStatus.COMPLETED))
            throw new AppException(ErrorCode.SUPPORT_COMPLETED);

        support.setStatus(request.getStatus());


        return supportMapper.toSupportResponse(
                supportRepository.save(support));
    }

}
