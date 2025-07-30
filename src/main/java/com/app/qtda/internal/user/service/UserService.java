package com.app.qtda.internal.user.service;

import com.app.qtda.internal.auth.repository.AccountRepository;
import com.app.qtda.internal.user.dto.request.UserSaveRequest;
import com.app.qtda.internal.user.dto.response.UserResponse;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.mapper.UserMapper;
import com.app.qtda.internal.user.repository.StaffRepository;
import com.app.qtda.internal.user.repository.StudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@Slf4j
public class UserService {
    AccountRepository accountRepository;
    StaffRepository staffRepository;
    StudentRepository studentRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    public List<UserResponse> findAll(){
        var accounts = accountRepository.findAll();
        return accounts.stream().map(account -> {
            var userResponse = userMapper.toUserResponse(account);
            if(account.getRole().equals("STUDENT")){
                Student student = studentRepository.findByAccount_UserID(account.getUserID().toString())
                        .orElseThrow(()->new RuntimeException("Khong tìm thấy student"));
                userResponse.setStudent(userMapper.toStudentResponse(student));
            }
            if(account.getRole().equals("STAFF")){
                Staff staff = staffRepository.findByAccount_UserID(account.getUserID().toString())
                        .orElseThrow(()->new RuntimeException("Khong tìm thấy staff"));
                userResponse.setStaff(userMapper.toStaffResponse(staff));
            }

            return userResponse;
        }).toList();
    }

    public List<UserResponse> signUps(List<UserSaveRequest> requests) {
        List<Staff> listStaffs = new ArrayList<>();
        List<Student> listStudents = new ArrayList<>();
        List<UserResponse> responses = new ArrayList<>();

        for (UserSaveRequest request : requests) {
            var account = userMapper.toAccount(request);
            account.setPassword(passwordEncoder.encode(account.getPassword()));

            if ("STAFF".equalsIgnoreCase(request.getRole())) {
                var staff = userMapper.toStaff(request);
                staff.setAccount(account);
                staff.setPosition(request.getStaff().getPosition());
                listStaffs.add(staff);
            }

            if ("STUDENT".equalsIgnoreCase(request.getRole())) {
                var student = userMapper.toStudent(request);
                student.setAccount(account);
                student.setDateOfBirth(request.getStudent().getDateOfBirth());
                student.setGender(request.getStudent().getGender());
                student.setClassName(request.getStudent().getClassName());
                listStudents.add(student);
            }
        }

        staffRepository.saveAll(listStaffs)
                .forEach(staff -> responses.add(UserResponse.builder()
                        .staff(userMapper.toStaffResponse(staff))
                        .build()));

        studentRepository.saveAll(listStudents)
                .forEach(student -> responses.add(UserResponse.builder()
                        .student(userMapper.toStudentResponse(student))
                        .build()));

        return responses;
    }



}
