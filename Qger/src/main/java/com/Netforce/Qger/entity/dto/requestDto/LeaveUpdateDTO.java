package com.Netforce.Qger.entity.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveUpdateDTO {

  private Integer daysUpdated;

  @NotNull(message = "USER_ID_REQUIRED")
  private Integer user;

  private byte transactionType;

  private String reason;

  @NotNull(message = "LEAVE_TYPE_REQUIRED")
  private Integer leaveType;
}
