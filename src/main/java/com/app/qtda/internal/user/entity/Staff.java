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
public class Staff extends InfoUserUtil {
    @Id
    String staffID;
    @PrePersist
    public void generateId() {
        if (staffID == null) {
            staffID = "STA-" + UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        }
    }

    String position;

    @OneToOne(cascade = {CascadeType.ALL})
    @JoinColumn(name = "userID", unique = true)
    Account account;
}
