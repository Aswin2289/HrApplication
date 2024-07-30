package com.Netforce.Qger.expectionHandler;

import org.springframework.security.authentication.BadCredentialsException;

public class InvalidUserException extends Exception{
    public InvalidUserException() {
    }

    public InvalidUserException(String message) {
        super(message);
    }

    public InvalidUserException(String message, BadCredentialsException e) {
        super(message, e);
    }

}
