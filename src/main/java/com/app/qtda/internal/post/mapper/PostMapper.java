package com.app.qtda.internal.post.mapper;

import com.app.qtda.internal.post.dto.request.EventRequest;
import com.app.qtda.internal.post.dto.request.PostSaveRequest;
import com.app.qtda.internal.post.dto.request.ScholarshipRequest;
import com.app.qtda.internal.post.dto.response.EventResponse;
import com.app.qtda.internal.post.dto.response.PostResponse;
import com.app.qtda.internal.post.dto.response.ScholarshipResponse;
import com.app.qtda.internal.post.entity.Event;
import com.app.qtda.internal.post.entity.Notification;
import com.app.qtda.internal.post.entity.Scholarship;
import com.app.qtda.internal.user.entity.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface PostMapper {
    @Mapping(target = "staffName", source = "staff", qualifiedByName = "getStaffName")
    PostResponse toPostResponse(Notification notification);
    EventResponse toEventResponse(Event event);
    ScholarshipResponse toScholarshipResponse(Scholarship scholarship);

    Notification toNotification(PostSaveRequest request);
    Event toEvent(EventRequest request);
    Scholarship toScholarship(ScholarshipRequest request);

    @Named("getStaffName")
    default String getStaffName(Staff staff){
        return staff.getFullName();
    }

    default PostResponse toPostResponse(Event event){
        PostResponse postResponse = toPostResponse(event.getNotification());
        postResponse.setEvent(toEventResponse(event));
        return postResponse;
    }

    default PostResponse toPostResponse(Scholarship scholarship){
        PostResponse postResponse = toPostResponse(scholarship.getNotification());
        postResponse.setScholarship(toScholarshipResponse(scholarship));
        return postResponse;
    }



}
