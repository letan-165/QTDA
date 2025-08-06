package com.app.qtda.internal.post.dto.response;

import com.app.qtda.common.enums.RegistrationStatus;
import com.app.qtda.internal.support.dto.response.StudentSPResponse;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegistrationResponse {
    Long registrationID;
    StudentSPResponse student;
    ScholarshipResponse scholarship;
    RegistrationStatus status;
    Instant createAt;
}
