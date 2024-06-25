package com.Netforce.Qger.entity.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class LeaveRequestDTO {


    @NotNull(message = "LEAVE_TYPE_REQUIRED")
    private Integer leaveType;

    @NotNull(message = "LEAVE_FROM_REQUIRED")
    private LocalDate from;

    @NotNull(message = "LEAVE_TO_REQUIRED")
    private LocalDate to;

    @NotNull(message = "USER_ID_REQUIRED")
    private String user;

    private byte transactionType;

    private String reason;
    private byte status;


}
