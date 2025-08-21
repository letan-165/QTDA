package com.app.qtda.internal.auth.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ForgotPassRequest {
    String username;
    String password;
    String email;
    int otp;
}
