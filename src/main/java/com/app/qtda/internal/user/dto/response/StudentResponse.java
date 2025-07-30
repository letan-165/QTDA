package com.app.qtda.internal.user.dto.response;

import com.app.qtda.common.util.InfoUserUtil;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentResponse extends InfoUserUtil{
    String studentID;
    String dateOfBirth;
    String gender;
    String className;
}
