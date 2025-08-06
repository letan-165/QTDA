package com.app.qtda.internal.post.mapper;


import com.app.qtda.internal.post.dto.response.RegistrationResponse;
import com.app.qtda.internal.post.dto.response.ScholarshipResponse;
import com.app.qtda.internal.post.entity.Registration;
import com.app.qtda.internal.post.entity.Scholarship;
import com.app.qtda.internal.support.dto.response.StudentSPResponse;
import com.app.qtda.internal.user.entity.Student;
import com.app.qtda.internal.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class RegistrationMapper {
    @Autowired
    PostMapper postMapper;
    @Autowired
    UserMapper userMapper;

    @Mapping(target = "student", source = "student", qualifiedByName = "toStudentSPResponse")
    @Mapping(target = "scholarship", source = "scholarship", qualifiedByName = "toScholarshipResponse")
    public abstract RegistrationResponse toRegistrationResponse(Registration registration);

    @Named("toStudentSPResponse")
    public StudentSPResponse toStudentSPResponse(Student student){
        return userMapper.toStudentSPResponse(student);
    }

    @Named("toScholarshipResponse")
    public ScholarshipResponse mapTotoScholarshipResponse(Scholarship scholarship){
        return postMapper.toScholarshipResponse(scholarship);
    }

}
