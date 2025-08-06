package com.app.qtda.internal.support.mapper;

import com.app.qtda.internal.support.dto.request.SupportCreateRequest;
import com.app.qtda.internal.support.dto.response.StudentSPResponse;
import com.app.qtda.internal.support.dto.response.SupportResponse;
import com.app.qtda.internal.support.dto.response.SupportStaffResponse;
import com.app.qtda.internal.support.entity.Response;
import com.app.qtda.internal.support.entity.Support;
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
    @Autowired
    ResponseMapper responseMapper;

    @Mapping(target = "student", source = "student", qualifiedByName = "toStudentResponse")
    @Mapping(target = "response", source = "response", qualifiedByName = "toResponse")
    public abstract SupportResponse toSupportResponse(Support support);
    public abstract Support toSupport(SupportCreateRequest request);

    @Named("toStudentResponse")
    public StudentSPResponse mapToStudentResponse(Student student) {
        return userMapper.toStudentSPResponse(student);
    }

    @Named("toResponse")
    public SupportStaffResponse mapToResponse(Response response) {
        return responseMapper.toSupportStaffResponse(response);
    }
}
