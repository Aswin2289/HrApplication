package com.Netforce.Qger.entity.dto.responseDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EligibilityResponseDTO {
    private boolean isEligible;
    private long daysLeft;
    private LocalDate eligibilityDate;
    private boolean applyEligibility;
    private long daysWorked;


}
