package com.app.qtda.common.util;

import jakarta.persistence.MappedSuperclass;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@MappedSuperclass
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InfoUserUtil {
    String fullName;
    String phone;
    String email;
}
