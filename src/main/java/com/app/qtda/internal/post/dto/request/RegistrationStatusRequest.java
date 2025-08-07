package com.app.qtda.internal.post.dto.request;

import com.app.qtda.common.enums.RegistrationStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegistrationStatusRequest {
    RegistrationStatus status;
}
