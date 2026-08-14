package com.rentsphere.payment.exception;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
        PaymentNotFoundException.class
    )
    public ResponseEntity<Map<String, Object>>
            handleNotFound(
                PaymentNotFoundException exception) {

        return buildResponse(
            HttpStatus.NOT_FOUND,
            exception.getMessage()
        );
    }

    @ExceptionHandler(
        PaymentProcessingException.class
    )
    public ResponseEntity<Map<String, Object>>
            handlePaymentProcessing(
                PaymentProcessingException exception) {

        return buildResponse(
            HttpStatus.BAD_REQUEST,
            exception.getMessage()
        );
    }

    @ExceptionHandler(
        MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
            handleValidation(
                MethodArgumentNotValidException exception) {

        Map<String, String> fieldErrors =
                new LinkedHashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                    fieldErrors.put(
                        error.getField(),
                        error.getDefaultMessage()
                    )
                );

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
            "timestamp",
            LocalDateTime.now()
        );

        body.put(
            "status",
            HttpStatus.BAD_REQUEST.value()
        );

        body.put(
            "error",
            "Validation failed"
        );

        body.put(
            "fieldErrors",
            fieldErrors
        );

        return ResponseEntity
                .badRequest()
                .body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>>
            handleUnexpected(
                Exception exception) {

        exception.printStackTrace();

        return buildResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Unexpected payment-service error"
        );
    }

    private ResponseEntity<Map<String, Object>>
            buildResponse(
                HttpStatus status,
                String message) {

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
            "timestamp",
            LocalDateTime.now()
        );

        body.put(
            "status",
            status.value()
        );

        body.put(
            "error",
            status.getReasonPhrase()
        );

        body.put(
            "message",
            message
        );

        return ResponseEntity
                .status(status)
                .body(body);
    }
}