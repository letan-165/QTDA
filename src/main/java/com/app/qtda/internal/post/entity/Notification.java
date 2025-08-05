package com.app.qtda.internal.post.entity;

import com.app.qtda.common.enums.NotificationType;
import com.app.qtda.common.util.FormUtil;
import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Entity
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification extends FormUtil {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long notificationID;

    @Enumerated(EnumType.STRING)
    NotificationType type;

    @ManyToOne
    @JoinColumn(name = "staffID")
    Staff staff;
}
