package com.app.qtda.internal.support.entity;

import com.app.qtda.common.util.FormUtil;
import com.app.qtda.internal.user.entity.Staff;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Response extends FormUtil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long responseID;

    @ManyToOne
    @JoinColumn(name = "staffID")
    Staff staff;

    @OneToOne
    @JoinColumn(name = "requestID")
    SupportRequest supportRequest;

}
