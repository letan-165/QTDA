package com.app.qtda.internal.support.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StudentSPResponse {
    String studentID;
    String fullName;
    String className;
}
