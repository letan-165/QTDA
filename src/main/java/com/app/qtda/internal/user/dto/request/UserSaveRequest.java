package com.app.qtda.internal.user.dto.request;

import com.app.qtda.common.util.InfoUserUtil;
import com.app.qtda.internal.user.dto.util.StaffSave;
import com.app.qtda.internal.user.dto.util.StudentSave;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserSaveRequest extends InfoUserUtil {
    String userID;
    String username;

    String password;
    String role;
    StaffSave staff;
    StudentSave student;
}
