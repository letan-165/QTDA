package com.app.qtda.internal.otp.dto.request;

import com.app.qtda.internal.otp.dto.Sender;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder(toBuilder = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmailFullRequest {
    Sender sender;
    List<Sender> to;
    String htmlContent;
    String subject;
}
