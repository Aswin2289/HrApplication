package com.Netforce.Qger.entity.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class EmployeeLeaveEligibilityResponseDTO {

    private Integer id;
    private String employeeId;
    private String name;
    private LocalDate passportExpire;
    private Integer noOfDaysPassportExpire;

    private EligibilityResponseDTO eligibilityResponseDTOS;
}
