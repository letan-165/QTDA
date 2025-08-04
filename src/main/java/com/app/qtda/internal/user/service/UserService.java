package com.app.qtda.internal.user.service;

import com.app.qtda.common.enums.AccountRole;
import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
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
import java.util.stream.Stream;

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
                Student student = studentRepository.findByAccount_UserID(account.getUserID())
                        .orElseThrow(()->new AppException(ErrorCode.STUDENT_NO_EXISTS));
                userResponse.setStudent(userMapper.toStudentResponse(student));
            }
            if(account.getRole().equals("STAFF")){
                Staff staff = staffRepository.findByAccount_UserID(account.getUserID())
                        .orElseThrow(()->new AppException(ErrorCode.STAFF_NO_EXISTS));
                userResponse.setStaff(userMapper.toStaffResponse(staff));
            }

            return userResponse;
        }).toList();
    }

    public List<UserResponse> save(List<UserSaveRequest> requests) {
        List<Staff> listStaffs = new ArrayList<>();
        List<Student> listStudents = new ArrayList<>();
        List<UserResponse> responses = new ArrayList<>();

        for (UserSaveRequest request : requests) {
            var account = userMapper.toAccount(request);
            account.setPassword(passwordEncoder.encode(account.getPassword()));

            switch (request.getRole()) {
                case STAFF: {
                    var staffID = staffRepository.findByAccount_UserID(request.getUserID())
                            .orElse(new Staff()).getStaffID();
                    var staff = userMapper.toStaff(request);
                    userMapper.updateStaffFromDto(request.getStaff(), staff);
                    staff.setAccount(account);
                    staff.setStaffID(staffID);
                    listStaffs.add(staff);
                    break;
                }
                case STUDENT:{
                    var studentID = studentRepository.findByAccount_UserID(request.getUserID())
                            .orElse(new Student()).getStudentID();
                    var student = userMapper.toStudent(request);
                    userMapper.updateStudentFromDto(request.getStudent(),student);
                    student.setAccount(account);
                    student.setStudentID(studentID);
                    listStudents.add(student);
                    break;
                }
                default: {
                    throw new AppException(ErrorCode.ROLE_INVALID);
                }
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

    public List<String> delete(List<String> userIDs) {
        var staffs = staffRepository.findAllByAccount_UserIDIn(userIDs);
        var students = studentRepository.findAllByAccount_UserIDIn(userIDs);

        staffRepository.deleteAll(staffs);
        studentRepository.deleteAll(students);

        return Stream.concat(
                staffs.stream().map(staff -> staff.getAccount().getUserID()),
                students.stream().map(student -> student.getAccount().getUserID()))
                .toList();
    }

}
