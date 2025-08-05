package com.app.qtda.internal.support.dto.request;

import com.app.qtda.common.util.FormUtil;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportSaveRequest extends FormUtil {
    Long supportID;
    String studentID;
    Long supportTypeID;
}
