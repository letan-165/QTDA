package com.app.qtda.internal.support.dto.response;

import com.app.qtda.common.enums.SupportStatus;
import com.app.qtda.common.util.FormUtil;
import com.app.qtda.internal.support.entity.SupportType;
import com.app.qtda.internal.user.dto.response.StudentResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportResponse extends FormUtil {
    Long supportID;
    SupportStatus status;
    StudentResponse student;
    SupportType supportType;
}
