package com.app.qtda.common.exception;

import com.app.qtda.common.ApiResponse;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandling {

    ResponseEntity<ApiResponse> toResponseEntity(ErrorCode errorCode){
        return ResponseEntity.status(errorCode.httpStatus)
                .body(ApiResponse.builder()
                        .code(errorCode.code)
                        .message(errorCode.message)
                        .build());
    }
    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse> handlingException(){
        return toResponseEntity(ErrorCode.OTHER_ERROL);
    }

    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse> handlingAppException(AppException e){
        return toResponseEntity(e.getErrorCode());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Throwable cause = ex.getCause();

        if (cause instanceof InvalidFormatException formatException) {
            Class<?> targetType = formatException.getTargetType();

            if (targetType != null && targetType.isEnum()) {
                String enumName = targetType.getSimpleName();

                return switch (enumName) {
                    case "AccountRole" -> toResponseEntity(ErrorCode.ROLE_INVALID);
                    case "StudentGender" -> toResponseEntity(ErrorCode.GENDER_INVALID);
                    case "RegistrationStatus" -> toResponseEntity(ErrorCode.REGISTRATION_INVALID);
                    case "NotificationType" -> toResponseEntity(ErrorCode.TYPE_INVALID);
                    case "SupportStatus" -> toResponseEntity(ErrorCode.SUPPORT_INVALID);
                    default -> toResponseEntity(ErrorCode.ENUM_INVALID);
                };
            }
        }
        return toResponseEntity(ErrorCode.ENUM_INVALID);
    }




}
