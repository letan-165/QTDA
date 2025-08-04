package com.app.qtda.internal.post.dto.response;

import com.app.qtda.common.util.FormUtil;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PostResponse extends FormUtil {
    String notificationID;
    String staffName;
    String type;
    ScholarshipResponse scholarship;
    EventResponse event;
}
