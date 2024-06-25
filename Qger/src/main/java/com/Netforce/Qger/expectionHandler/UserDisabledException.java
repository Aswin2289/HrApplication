package com.Netforce.Qger.expectionHandler;

import org.springframework.security.authentication.DisabledException;

public class UserDisabledException extends Exception {
    public UserDisabledException() {
    }

    public UserDisabledException(String message) {
        super(message);
    }

    public UserDisabledException(String message, DisabledException e) {
        super(message, e);
    }

}
