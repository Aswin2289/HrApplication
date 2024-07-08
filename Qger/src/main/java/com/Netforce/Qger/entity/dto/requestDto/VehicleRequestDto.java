package com.Netforce.Qger.entity.dto.requestDto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleRequestDto {

    @NotNull(message = "VEHICLE_NUMBER_REQUIRED")
    private String vehicleNumber;

    @NotNull(message = "MANUFACTURE_DATE_REQUIRED")
    private LocalDate manufactureDate;

    @NotNull(message = "VEHICLE_TYPE_REQUIRED")
    private byte vehicleType;

    @NotNull(message = "MODEL_REQUIRED")
    private String modal;

    @NotNull(message = "BRAND_REQUIRED")
    private String brand;

    @NotNull(message = "INSURANCE_PROVIDER_REQUIRED")
    private String insuranceProvider;

    @NotNull(message = "INSURANCE_EXPIRE_DATE_REQUIRED")
    private LocalDate insuranceExpire;

    @NotNull(message = "ISTIMARA_REQUIRED")
    private LocalDate istimaraDate;

    @NotNull(message = "TOTAL_KILOMETER_REQUIRED")
    private long totalKilometer;

    @NotNull(message = "ISTIMARA_NUMBER_REQUIRED")
    private long istimaraNumber;

    @NotNull(message = "REGISTRATION_DATE_REQUIRED")
    private LocalDate registrationDate;

    private String remarks;
}
