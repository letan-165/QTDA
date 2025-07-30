package com.app.qtda.internal.support.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long supportTypeID;
    String name;
    String description;
}
