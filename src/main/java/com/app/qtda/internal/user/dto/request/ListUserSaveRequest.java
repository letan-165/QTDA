package com.app.qtda.internal.user.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ListUserSaveRequest {
    List<UserSaveRequest> users;
}
