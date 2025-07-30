package com.app.qtda.internal.user.mapper;

import com.app.qtda.internal.auth.entity.Account;
import com.app.qtda.internal.user.dto.request.UserSaveRequest;
import com.app.qtda.internal.user.dto.response.StaffResponse;
import com.app.qtda.internal.user.dto.response.StudentResponse;
import com.app.qtda.internal.user.dto.response.UserResponse;
import com.app.qtda.internal.user.dto.util.StaffSave;
import com.app.qtda.internal.user.dto.util.StudentSave;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toUserResponse(Account account);

    Account toAccount(UserSaveRequest request);
    Staff toStaff(UserSaveRequest request);
    Student toStudent(UserSaveRequest request);
    Student toStudent(StudentSave request);
    StudentResponse toStudentResponse(Student student);
    StaffResponse toStaffResponse(Staff staff);

    void updateStaffFromDto(StaffSave dto, @MappingTarget Staff staff);
    void updateStudentFromDto(StudentSave dto, @MappingTarget Student student);
}
