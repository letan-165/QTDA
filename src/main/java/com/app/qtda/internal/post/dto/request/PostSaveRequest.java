package com.app.qtda.internal.post.dto.request;

import com.app.qtda.common.enums.NotificationType;
import com.app.qtda.common.util.FormUtil;
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
public class PostSaveRequest extends FormUtil {
    Long notificationID;
    NotificationType type;
    ScholarshipRequest scholarship;
    EventRequest event;
}