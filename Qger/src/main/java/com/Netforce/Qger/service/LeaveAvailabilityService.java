package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.YearEligibilityResponseDTO;

public interface LeaveAvailabilityService {
    EligibilityResponseDTO checkEligibilityForYearlyLeaveAndFlight(User user);

    YearEligibilityResponseDTO checkEligibility();
}
