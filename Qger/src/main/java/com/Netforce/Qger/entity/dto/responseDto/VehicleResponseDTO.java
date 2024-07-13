package com.Netforce.Qger.entity.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleResponseDTO {

    private long id;
    private String vehicleNumber;
    private byte vehicleType;
    private String modal;
    private String brand;
    private String insuranceProvider;
    private LocalDate insuranceExpire;

    private LocalDate istimaraDate;

    private long totalKilometer;
    private byte assigned;
    private byte status;
    private long istimaraNumber;

    private LocalDate registrationDate;
    private LocalDate manufactureDate;
    private String userName;
    private Integer noOfDaysInsuranceExpire;
    private Integer noOfDaysIstimaraExpire;


//    public VehicleResponseDTO(Long id, String vehicleNumber, byte vehicleType, String modal, String brand, String insuranceProvider, LocalDate insuranceExpire, LocalDate istimaraDate, long totalKilometer, Integer noOfDaysInsuranceExpire, Integer noOfDaysIstimara) {
//    this.id=id;
//    this.vehicleNumber=vehicleNumber;
//    this.vehicleType=vehicleType;
//    this.modal=modal;
//    this.brand=brand;
//    this.insuranceProvider=insuranceProvider;
//    this.insuranceExpire=insuranceExpire;
//    this.istimaraDate=istimaraDate;
//    this.totalKilometer=totalKilometer;
//
//    }
}
