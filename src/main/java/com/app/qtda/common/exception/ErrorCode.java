package com.app.qtda.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    STUDENT_NO_EXISTS(1008,"Student not exists", HttpStatus.BAD_REQUEST),
    STAFF_NO_EXISTS(1007,"Staff not exists", HttpStatus.BAD_REQUEST),
    TOKEN_LOGOUT(1006,"Token had logout", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1005,"Password don't valid", HttpStatus.BAD_REQUEST),
    AUTHENTICATION(1004,"Token not authentication ", HttpStatus.UNAUTHORIZED),
    AUTHORIZED(1003,"You don't have permission", HttpStatus.FORBIDDEN),
    ACCOUNT_EXISTS(1002,"Account existed", HttpStatus.BAD_REQUEST),
    ACCOUNT_NO_EXISTS(1001,"Account not exists", HttpStatus.BAD_REQUEST),
    OTHER_ERROL(9999,"Other errol", HttpStatus.INTERNAL_SERVER_ERROR);

    int code;
    String message;
    HttpStatusCode httpStatus;
}
