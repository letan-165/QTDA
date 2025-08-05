package com.app.qtda.internal.auth.entity;

import com.app.qtda.common.enums.AccountRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Account {
    @Id
    String userID;

    @Column(unique = true)
    String username;
    String password;

    @Enumerated(EnumType.STRING)
    AccountRole role;
}
