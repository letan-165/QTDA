package com.app.qtda.internal.support.dto.request;

import com.app.qtda.common.enums.SupportStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportStateRequest {
    SupportStatus status;
}
