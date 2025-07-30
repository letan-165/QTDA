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

    public List<UserResponse> findAll(){
        var accounts = accountRepository.findAll();
        return accounts.stream().map(account -> {
            var userResponse = userMapper.toUserResponse(account);
            if(account.getRole().equals("STUDENT")){
                Student student = studentRepository.findByAccount_UserID(account.getUserID().toString())
                        .orElseThrow(()->new RuntimeException("Khong tìm thấy student"));
                userResponse.setStudent(student);
            }
            if(account.getRole().equals("STAFF")){
                Staff staff = staffRepository.findByAccount_UserID(account.getUserID().toString())
                        .orElseThrow(()->new RuntimeException("Khong tìm thấy staff"));
                userResponse.setStaff(staff);
            }

            return userResponse;
        }).toList();
    }

    public List<UserResponse> saveAll(List<UserSaveRequest> requests){
        var listStaffs = requests.stream()
                .filter(request-> request.getRole().equals("STAFF"))
                .map(request->{
                    var staff = userMapper.toStaff(request);
                    staff.setAccount(userMapper.toAccount(request));
                    staff.setPosition(request.getStaff().getPosition());
                    return staff;}).toList();

        var listStudents = requests.stream()
                .filter(request-> request.getRole().equals("STUDENT"))
                .map(request->{
                    var student = userMapper.toStudent(request);
                    student.setAccount(userMapper.toAccount(request));
                    student.setDateOfBirth(request.getStudent().getDateOfBirth());
                    student.setGender(request.getStudent().getGender());
                    student.setClassName(request.getStudent().getClassName());
                    return student;}).toList();
        List<UserResponse> response = new ArrayList<>();
        staffRepository.saveAll(listStaffs)
                .forEach(staff -> response.add(UserResponse.builder().staff(staff).build()));
        studentRepository.saveAll(listStudents)
                .forEach(student -> response.add(UserResponse.builder().student(student).build()));


        return response;
    }



}
