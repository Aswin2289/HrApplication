package com.Netforce.Qger.entity.dto.responseDto;
public class ErrorResponseDTO {
    private String errorCode;
    private String errorMessage;

    public ErrorResponseDTO(String errorMessage, String errorCode) {

        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public ErrorResponseDTO() {

        this.errorCode = "0";
        this.errorMessage = "";
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

}
