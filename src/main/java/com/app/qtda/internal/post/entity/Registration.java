package com.app.qtda.internal.post.entity;

import com.app.qtda.internal.user.entity.Staff;
import com.app.qtda.internal.user.entity.Student;
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
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long registrationID;

    @ManyToOne
    @JoinColumn(name = "studentID")
    Student student;

    @ManyToOne
    @JoinColumn(name = "scholarshipID")
    Scholarship scholarship;
    String status;
    Instant createAt;
}
