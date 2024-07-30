package com.Netforce.Qger.expectionHandler;

import org.springframework.security.core.AuthenticationException;

public class UserAuthenticationException extends Exception {

    public UserAuthenticationException() {
    }

    public UserAuthenticationException(String message) {
        super(message);
    }

    public UserAuthenticationException(String message, AuthenticationException e) {
        super(message, e);
    }

}
