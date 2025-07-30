package com.app.qtda.internal.post.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Scholarship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long scholarshipID;
    Instant deadline;

    @OneToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "notificationID", nullable = true)
    Notification notification;


    @Column(precision = 19, scale = 0)
    BigDecimal amount;
}
