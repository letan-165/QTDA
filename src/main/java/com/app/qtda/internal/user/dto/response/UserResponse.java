package com.app.qtda.internal.user.dto.response;

import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserResponse {
    String userID;
    String username;
    String role;
    StaffResponse staff;
    StudentResponse student;
}
