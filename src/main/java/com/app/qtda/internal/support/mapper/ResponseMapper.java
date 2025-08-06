package com.app.qtda.internal.support.mapper;

import com.app.qtda.internal.support.dto.request.ResponseCreateRequest;
import com.app.qtda.internal.support.dto.response.StaffSPResponse;
import com.app.qtda.internal.support.dto.response.SupportStaffResponse;
import com.app.qtda.internal.support.entity.Response;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ResponseMapper {
    @Autowired
    UserMapper userMapper;

    @Mapping(target = "staff", source = "staff", qualifiedByName = "toStaffSPResponse")
    public abstract SupportStaffResponse toSupportStaffResponse(Response response);
    public abstract Response toResponse(ResponseCreateRequest request);

    @Named("toStaffSPResponse")
    public StaffSPResponse toStaffSPResponse(Staff staff){
        return userMapper.toStaffSPResponse(staff);
    }
}
