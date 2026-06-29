package com.goldenboat.quanlytro.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s khong ton tai voi %s = '%s'", resource, field, value));
    }
}
