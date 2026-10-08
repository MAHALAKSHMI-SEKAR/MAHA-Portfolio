package com.backend.portfolio.service;

import org.springframework.http.HttpStatus;

public class EmailDeliveryException extends RuntimeException {
    private final HttpStatus status;
    private final String publicMessage;

    public EmailDeliveryException(String message, HttpStatus status, String publicMessage) {
        super(message);
        this.status = status;
        this.publicMessage = publicMessage;
    }

    public EmailDeliveryException(String message, HttpStatus status, String publicMessage, Throwable cause) {
        super(message, cause);
        this.status = status;
        this.publicMessage = publicMessage;
    }

    public HttpStatus getStatus() { return status; }
    public String getPublicMessage() { return publicMessage; }
}
