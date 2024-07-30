package com.Netforce.Qger.entity.dto.requestDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEligibilityDateRequestDTO {

    private Date lastEligilibleDate;
}
