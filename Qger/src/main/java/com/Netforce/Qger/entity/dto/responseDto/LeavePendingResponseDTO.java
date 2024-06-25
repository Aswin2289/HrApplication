package com.Netforce.Qger.entity.dto.responseDto;

import com.Netforce.Qger.entity.LeaveType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class LeavePendingResponseDTO {

    private Long id;
    private String leaveType;
    private LocalDate from;
    private LocalDate to;
    private String reason;
    private byte status;
    private String name;
    private Integer availableLeaveBalance;
}
