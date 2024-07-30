package com.Netforce.Qger.entity.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeaveTypeRequestDTO {

    @NotNull(message = "LEAVE_TYPE_REQUIRED")
    private String name;
}

