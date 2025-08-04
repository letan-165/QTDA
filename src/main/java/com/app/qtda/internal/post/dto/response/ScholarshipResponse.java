package com.app.qtda.internal.post.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScholarshipResponse {
    Long scholarshipID;
    Instant deadline;
    BigDecimal amount;
}
