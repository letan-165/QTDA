package com.app.qtda.internal.support.entity;

import com.app.qtda.common.enums.SupportStatus;
import com.app.qtda.common.util.FormUtil;
import com.app.qtda.internal.user.entity.Student;
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
public class Support extends FormUtil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long supportID;

    @Enumerated(EnumType.STRING)
    SupportStatus status;

    @ManyToOne
    @JoinColumn(name = "studentID")
    Student student;

    @ManyToOne
    @JoinColumn(name = "supportTypeID")
    SupportType supportType;

}
