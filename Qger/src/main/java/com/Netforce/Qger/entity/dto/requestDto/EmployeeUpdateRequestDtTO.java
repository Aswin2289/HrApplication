package com.Netforce.Qger.entity.dto.requestDto;


import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class EmployeeUpdateRequestDtTO {
    @NotNull(message = "EMPLOYEEID_NEEDED")
    private String employeeId;

    @NotNull(message = "NAME_REQUIRED")
    @Pattern(regexp = "^[a-zA-Z]+[a-zA-Z\\s]*$", message = "NAME_ALPHANUMERIC_ONLY")
    private String name;

    @NotNull(message = "QID_REQUIRED")
    private String qid;

    @NotNull(message = "QID_EXPIRE_REQUIRED")
    private LocalDate qidExpire;

    private byte gender;

    private String nationality;

    private String qualification;

    private String jobTitle;

    @NotNull(message = "CONTRACT_PERIOD_REQUIRED")
    private String contractPeriod;


    @NotNull(message = "ROLE_NEEDED")
    private Integer role;

    @NotNull(message = "JOINING_DATE_REQUIRED")
    private Date joiningDate;

    private Integer prevExperience;

    @NotNull(message = "EXPERIENCE_REQUIRED")
    private Integer experience;

    @NotNull
    @Pattern(regexp = "^(?!^0+$)[a-zA-Z0-9]{6,20}$", message = "PASSPORT_INVALID")
    private String passport;

    @NotNull(message = "PASSPORT_EXPIRE_REQUIRED")
    private LocalDate passportExpire;

    private String license;

    private LocalDate licenseExpire;

    private byte department;

}
