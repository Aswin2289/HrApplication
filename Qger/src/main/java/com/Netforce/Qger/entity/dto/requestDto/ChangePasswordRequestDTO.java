package com.Netforce.Qger.entity.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequestDTO {

    @NotNull(message = "CURRENT_PASSWORD")
    @Size(min = 8,max = 16,message = "PASSWORD_LENGTH_REQUIRED")
    private String currentPassword;

    @NotNull(message = "NEW_PASSWORD")
    @Size(min = 8,max = 16,message = "PASSWORD_LENGTH_REQUIRED")
    private String newPassword;

    @NotNull(message = "CONFIRM_PASSWORD")
    @Size(min = 8,max = 16,message = "PASSWORD_LENGTH_REQUIRED")
    private String confirmPassword;

}
