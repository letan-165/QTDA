package com.app.qtda.internal.user.dto.response;

import com.app.qtda.common.enums.AccountRole;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(value = JsonInclude.Include.NON_NULL)
public class UserResponse {
    String userID;
    String username;
    AccountRole role;
    StaffResponse staff;
    StudentResponse student;
}
