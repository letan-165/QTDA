package com.app.qtda.internal.post.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long eventID;

    @OneToOne(optional = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "notificationID", nullable = true)
    Notification notification;


    Instant startDate;
    String location;
}
