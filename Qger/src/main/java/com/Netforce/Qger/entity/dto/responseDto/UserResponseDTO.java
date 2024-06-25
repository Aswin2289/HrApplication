package com.Netforce.Qger.entity.dto.responseDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
public class UserResponseDTO {
    private Integer id;
    private String employeeId;
    private String name;
    private String jobTitle;
    private LocalDate qidExpire;
    private LocalDate passportExpire;
    private Integer noOfDaysQidExpire;
    private Integer noOfDaysPassportExpire;

    // Constructors, getters, and setters

    public UserResponseDTO(Integer id,String employeeId, String name, String jobTitle, LocalDate qidExpire, LocalDate passportExpire,Integer noOfDaysQidExpire,Integer noOfDaysPassportExpire) {
        this.id=id;
        this.employeeId = employeeId;
        this.name = name;
        this.jobTitle = jobTitle;
        this.qidExpire = qidExpire;
        this.passportExpire = passportExpire;
        this.noOfDaysQidExpire=noOfDaysQidExpire;
        this.noOfDaysPassportExpire=noOfDaysPassportExpire;
    }
    public UserResponseDTO(Integer id,String employeeId, String name, String jobTitle, LocalDate qidExpire, LocalDate passportExpire) {
        this.id=id;
        this.employeeId = employeeId;
        this.name = name;
        this.jobTitle = jobTitle;
        this.qidExpire = qidExpire;
        this.passportExpire = passportExpire;

    }

}
