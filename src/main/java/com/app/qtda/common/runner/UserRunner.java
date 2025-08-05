package com.app.qtda.common.runner;

import com.app.qtda.common.enums.AccountRole;
import com.app.qtda.common.enums.StudentGender;
import com.app.qtda.internal.auth.entity.Account;
import com.app.qtda.internal.auth.repository.AccountRepository;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.mapper.UserMapper;
import com.app.qtda.internal.user.repository.StaffRepository;
import com.app.qtda.internal.user.repository.StudentRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;


@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserRunner {
    AccountRepository accountRepository;
    StaffRepository staffRepository;
    StudentRepository studentRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(){
        return ApplicationRunner -> {
            List<Student> students = createDefaultStudent();
            List<Staff> staffs = createDefaultStaff();

            var checkSTU = studentRepository.findAll();
            var checkSTA = staffRepository.findAll();
            if(checkSTU.isEmpty())
                studentRepository.saveAll(students);

            if(checkSTA.isEmpty())
                staffRepository.saveAll(staffs);
        };
    }
    List<Student> createDefaultStudent(){
        return List.of(
                Student.builder()
                        .studentID("STU-00000tan")
                        .fullName("TanStudent")
                        .phone("0703")
                        .email("tanstu@gmail.com")
                        .dateOfBirth(LocalDate.now().minusYears(10))
                        .gender(StudentGender.NAM)
                        .className("CN22")
                        .account(Account.builder()
                                .userID("tanSTU")
                                .username("tan1")
                                .password("1")
                                .role(AccountRole.STUDENT)
                                .build())
                        .build(),
                Student.builder()
                        .studentID("STU-00000phu")
                        .fullName("PhuStudent")
                        .phone("0903")
                        .email("phustu@gmail.com")
                        .dateOfBirth(LocalDate.now().minusYears(9))
                        .gender(StudentGender.NAM)
                        .className("CN21")
                        .account(Account.builder()
                                .userID("phuSTU")
                                .username("phu1")
                                .password("1")
                                .role(AccountRole.STUDENT)
                                .build())
                        .build());
    }
    List<Staff> createDefaultStaff(){
        return List.of(
                Staff.builder()
                        .staffID("STA-00000tan")
                        .fullName("TanStaff")
                        .phone("0703")
                        .email("tanstaff@gmail.com")
                        .position("Staff002")
                        .account(Account.builder()
                                .userID("tanSTA")
                                .username("tan2")
                                .password("1")
                                .role(AccountRole.STAFF)
                                .build())
                        .build(),

                Staff.builder()
                        .staffID("STA-00000phu")
                        .fullName("PhuStaff")
                        .phone("0903")
                        .email("phustaff@gmail.com")
                        .position("Staff003")
                        .account(Account.builder()
                                .userID("phuSTA")
                                .username("phu2")
                                .password("1")
                                .role(AccountRole.STAFF)
                                .build())
                        .build()

        );
    }
}
