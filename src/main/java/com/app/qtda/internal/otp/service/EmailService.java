package com.app.qtda.internal.otp.service;

import com.app.qtda.internal.otp.dto.Sender;
import com.app.qtda.internal.otp.dto.request.EmailFullRequest;
import com.app.qtda.internal.otp.dto.request.SendEmailRequest;
import com.app.qtda.internal.otp.dto.response.EmailResponse;
import com.app.qtda.internal.otp.repository.Client.EmailClient;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    EmailClient emailClient;

    @NonFinal
    @Value("${app.client.contact.email}")
    String emailContact;

    @NonFinal
    @Value("${app.client.contact.name}")
    String nameEmail;

    @NonFinal
    @Value("${key.brevo}")
    String keyEmail;

    public EmailResponse sendEmail(SendEmailRequest request){
        EmailFullRequest emailFullRequest = EmailFullRequest.builder()
                .sender(Sender.builder()
                        .email(emailContact)
                        .name(nameEmail)
                        .build())
                .to(new ArrayList<>(List.of(request.getTo())))
                .htmlContent("<h3>"+nameEmail+" chào bạn,</h2></br><p>"
                        + request.getContent()
                        +"</p></br><h4>"+nameEmail+" xin cám ơn!</h4>")
                .subject(request.getSubject())
                .build();
        log.info("emailContact{}",emailContact);
        log.info("keyEmail{}",keyEmail);
        return emailClient.sendEmail(keyEmail,emailFullRequest);
    }

}
