package com.Netforce.Qger.entity.dto.responseDto;

import lombok.Data;
import lombok.Setter;

@Data
public class SuccessResponseDTO {
    private String successCode;
    private String successMessage;

    public SuccessResponseDTO() {
    }

    public SuccessResponseDTO(String successCode, String successMessage) {
        this.successCode = successCode;
        this.successMessage = successMessage;
    }

}
