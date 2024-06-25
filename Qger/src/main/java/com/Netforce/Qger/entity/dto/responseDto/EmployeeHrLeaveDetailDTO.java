package com.Netforce.Qger.entity.dto.responseDto;


import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class EmployeeHrLeaveDetailDTO {

    private String employeeId;
    private String name;
    private int casualLeaveTaken;
    private int casualLeaveBalance;
    private int sickLeaveTaken;
    private int sickLeaveBalance;

    public EmployeeHrLeaveDetailDTO(String employeeId, String name, int casualLeaveTaken, int casualLeaveBalance, int sickLeaveTaken, int sickLeaveBalance) {
        this.employeeId = employeeId;
        this.name = name;
        this.casualLeaveTaken = casualLeaveTaken;
        this.casualLeaveBalance = casualLeaveBalance;
        this.sickLeaveTaken = sickLeaveTaken;
        this.sickLeaveBalance = sickLeaveBalance;
    }

    public EmployeeHrLeaveDetailDTO(String employeeId, String name) {
        this.employeeId = employeeId;
        this.name = name;
    }
}
