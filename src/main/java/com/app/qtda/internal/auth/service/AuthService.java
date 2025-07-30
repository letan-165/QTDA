package com.app.qtda.internal.auth.service;


import com.app.qtda.common.exception.AppException;
import com.app.qtda.common.exception.ErrorCode;
import com.app.qtda.internal.auth.dto.request.LoginRequest;
import com.app.qtda.internal.auth.dto.request.TokenRequest;
import com.app.qtda.internal.auth.entity.Account;
import com.app.qtda.internal.auth.repository.AccountRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthService {
    @NonFinal
    @Value("${key.value}")
    String KEY;

    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;

    public String login(LoginRequest request) {
        Account Account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(()->new AppException(ErrorCode.ACCOUNT_EXISTS));

        if (!passwordEncoder.matches(request.getPassword(),Account.getPassword()))
            throw new AppException(ErrorCode.PASSWORD_INVALID);

        return generaToken(Account);
    }

    public Boolean instropect(TokenRequest request) throws JOSEException, ParseException {
        if(request.getToken().isEmpty())
            throw new AppException(ErrorCode.TOKEN_LOGOUT);

        JWSVerifier jwsVerifier = new MACVerifier(KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(request.getToken());
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(jwsVerifier);

        return verified && expiryTime.after(new Date());
    }

    public String findUserID(String token){
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.AUTHENTICATION);
        }

    }

    public String generaToken(Account account){
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .jwtID(UUID.randomUUID().toString())
                .issuer("QTDA")
                .subject(account.getUserID().toString())
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(1, ChronoUnit.MINUTES).toEpochMilli()))
                .claim("scope",account.getRole())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS256);
        JWSObject jwsObject = new JWSObject(jwsHeader,payload);

        try {
            jwsObject.sign(new MACSigner(KEY.getBytes()));
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
        return jwsObject.serialize();
    }
}
