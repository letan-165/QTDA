package com.app.qtda.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    STUDENT_REGISTERED(1029,"Students who have applied for scholarships", HttpStatus.BAD_REQUEST),
    REGISTRATION_CANCELLED(1028,"Registration has been CANCELLED", HttpStatus.BAD_REQUEST),
    REGISTRATION_EXPIRED(1027,"Registration has been EXPIRED", HttpStatus.BAD_REQUEST),
    REGISTRATION_NO_EXISTS(1026,"Registration not exists", HttpStatus.BAD_REQUEST),
    RESPONSE_NO_EXISTS(1025,"Response not exists", HttpStatus.BAD_REQUEST),
    SUPPORT_NO_APPROVED(1024,"Support not APPROVED", HttpStatus.BAD_REQUEST),
    SUPPORT_CANCELLED(1023,"Support has been CANCELLED", HttpStatus.BAD_REQUEST),
    SUPPORT_COMPLETED(1022,"Support has been COMPLETED", HttpStatus.BAD_REQUEST),
    SUPPORT_NO_UPDATE(1021,"Unable to update support because other PENDING", HttpStatus.BAD_REQUEST),
    SUPPORT_NO_EXISTS(1020,"Support not exists", HttpStatus.BAD_REQUEST),
    SUPPORT_TYPE_NO_EXISTS(1019,"Support type not exists", HttpStatus.BAD_REQUEST),
    ENUM_INVALID(1018,"Enum invalid", HttpStatus.BAD_REQUEST),
    TYPE_UPDATE_INVALID(1017,"Not allowed to change type", HttpStatus.BAD_REQUEST),
    NOTIFICATION_NO_EXISTS(1016,"Notification not exists", HttpStatus.BAD_REQUEST),
    EVENT_NO_EXISTS(1015,"Event not exists", HttpStatus.BAD_REQUEST),
    SCHOLARSHIP_NO_EXISTS(1014,"Scholarship not exists", HttpStatus.BAD_REQUEST),
    SUPPORT_INVALID(1013,"Support not included ( PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED)", HttpStatus.BAD_REQUEST),
    REGISTRATION_INVALID(1012,"Registration not included ( PENDING, APPROVED, REJECTED, CANCELLED, EXPIRED)", HttpStatus.BAD_REQUEST),
    GENDER_INVALID(1011,"Gender not included (NAM, NU)", HttpStatus.BAD_REQUEST),
    TYPE_INVALID(1010,"Type not included (DEFAULT, EVENT, SCHOLARSHIP)", HttpStatus.BAD_REQUEST),
    ROLE_INVALID(1009,"Role not included (ADMIN, STAFF, STUDENT)", HttpStatus.BAD_REQUEST),
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
