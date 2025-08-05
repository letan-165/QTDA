package com.app.qtda.internal.user.dto.response;

import com.app.qtda.common.enums.StudentGender;
import com.app.qtda.common.util.InfoUserUtil;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.time.LocalDate;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentResponse extends InfoUserUtil{
    String studentID;
    LocalDate dateOfBirth;
    StudentGender gender;
    String className;
}
