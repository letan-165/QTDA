package com.app.qtda.internal.support.dto.response;

import com.app.qtda.common.util.FormUtil;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportStaffResponse extends FormUtil {
    Long responseID;
    StaffSPResponse staff;
}
