package com.app.qtda.internal.support.dto.request;

import com.app.qtda.internal.support.entity.SupportType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportTypeSavesRequest {
    List<SupportType> supportTypes;
}
