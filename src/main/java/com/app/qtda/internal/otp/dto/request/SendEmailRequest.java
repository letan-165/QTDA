package com.app.qtda.internal.otp.dto.request;
import com.app.qtda.internal.otp.dto.Sender;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SendEmailRequest {
    Sender to;
    String subject;
    String content;
}
