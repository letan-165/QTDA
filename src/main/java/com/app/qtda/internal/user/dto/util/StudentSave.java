package com.app.qtda.internal.user.dto.util;

import com.app.qtda.common.enums.StudentGender;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentSave {
    LocalDate dateOfBirth;
    StudentGender gender;
    String className;
}
