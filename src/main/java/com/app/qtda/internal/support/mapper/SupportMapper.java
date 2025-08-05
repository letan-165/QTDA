package com.app.qtda.internal.support.mapper;

import com.app.qtda.internal.support.dto.request.SupportSaveRequest;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.entity.Support;
import com.app.qtda.internal.user.dto.response.StudentResponse;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class SupportMapper {
    @Autowired
    UserMapper userMapper;

    @Mapping(target = "student", source = "student", qualifiedByName = "toStudentResponse")
    public abstract SupportResponse toSupportResponse(Support support);
    public abstract Support toSupport(SupportSaveRequest request);

    @Named("toStudentResponse")
    public StudentResponse mapToStudentResponse(Student student) {
        return userMapper.toStudentResponse(student);
    }
}
