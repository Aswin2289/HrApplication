package com.Netforce.Qger.entity.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDetailsResponseDTO {

    private Long id;
    private String employeeId;
    private String qid;
    private LocalDate qidExpire;
    private String name;
    private String jobTitle;
    private LocalDate passportExpire;
    private String license;
    private LocalDate licenseExpire;
    private byte gender;
    private String nationality;
    private String passport;
    private String qualification;
    private byte status;
    private String contractPeriod;
    private Integer experience;
    private Integer totalExperience;
    private String role;
    private Date joiningDate;
    private Integer noOfDaysQidExpire;
    private Integer noOfDaysPassportExpire;
    private Integer noOfDaysLicenseExpire;
}
