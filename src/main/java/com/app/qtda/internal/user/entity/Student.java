package com.app.qtda.internal.user.entity;

import com.app.qtda.common.util.InfoUserUtil;
import com.app.qtda.internal.auth.entity.Account;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

import java.util.UUID;


@Entity
@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Student extends InfoUserUtil {
    @Id
    String studentID;

    @PrePersist
    public void generateId() {
        if (studentID == null) {
            studentID = "STU-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        }
    }

    String dateOfBirth;
    String gender;
    String className;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "userID", unique = true)
    Account account;
}
