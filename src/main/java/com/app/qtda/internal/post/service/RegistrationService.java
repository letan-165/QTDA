package com.app.qtda.internal.post.service;

import com.app.qtda.common.enums.RegistrationStatus;
import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.post.dto.request.RegistrationCreateRequest;
import com.app.qtda.internal.post.dto.request.RegistrationStatusRequest;
import com.app.qtda.internal.post.dto.response.RegistrationResponse;
import com.app.qtda.internal.post.entity.Registration;
import com.app.qtda.internal.post.entity.Scholarship;
import com.app.qtda.internal.post.mapper.RegistrationMapper;
import com.app.qtda.internal.post.repository.RegistrationRepository;
import com.app.qtda.internal.post.repository.ScholarshipRepository;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.repository.StudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RegistrationService {
    RegistrationRepository registrationRepository;
    StudentRepository studentRepository;
    ScholarshipRepository scholarshipRepository;
    RegistrationMapper registrationMapper;

    public List<RegistrationResponse> getAll(){
        var list = registrationRepository.findAll();
        return list.stream()
                .map(registrationMapper::toRegistrationResponse)
                .toList();
    }

    public List<RegistrationResponse> getAllStatus(RegistrationStatusRequest request){
        var list = registrationRepository.findAll();
        return list.stream()
                .filter(registration -> registration.getStatus().equals(request.getStatus()))
                .map(registrationMapper::toRegistrationResponse)
                .toList();
    }

    public List<RegistrationResponse> getAllByStudent(String studentID){
        var list = registrationRepository.findAllByStudent_StudentID(studentID);
        return list.stream()
                .map(registrationMapper::toRegistrationResponse)
                .toList();
    }

    public RegistrationResponse create (RegistrationCreateRequest request){
        Student student = studentRepository.findById(request.getStudentID())
                .orElseThrow(()-> new AppException(ErrorCode.STUDENT_NO_EXISTS));

        Scholarship scholarship = scholarshipRepository.findById(request.getScholarshipID())
                .orElseThrow(()-> new AppException(ErrorCode.SCHOLARSHIP_NO_EXISTS));

        if(registrationRepository.existsByStudent_StudentIDAndScholarship_ScholarshipID(request.getStudentID(),request.getScholarshipID()))
            throw new AppException(ErrorCode.STUDENT_REGISTERED);

        var status = Instant.now().isBefore(scholarship.getDeadline())
                ? RegistrationStatus.PENDING
                : RegistrationStatus.EXPIRED;

        Registration registration = Registration.builder()
                .student(student)
                .scholarship(scholarship)
                .status(status)
                .build();

        return registrationMapper.toRegistrationResponse(
                registrationRepository.save(registration));
    }

    public RegistrationResponse saveStatus(Long registrationID, RegistrationStatusRequest request){
        Registration registration = registrationRepository.findById(registrationID)
                .orElseThrow(()-> new AppException(ErrorCode.REGISTRATION_NO_EXISTS));

        if(registration.getStatus().equals(RegistrationStatus.EXPIRED))
            throw new AppException(ErrorCode.REGISTRATION_EXPIRED);

        if(registration.getStatus().equals(RegistrationStatus.CANCELLED))
            throw new AppException(ErrorCode.REGISTRATION_CANCELLED);

        registration.setStatus(request.getStatus());

        return registrationMapper.toRegistrationResponse(
                registrationRepository.save(registration));
    }



}