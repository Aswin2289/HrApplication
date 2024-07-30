package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeLeaveEligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.YearEligibilityResponseDTO;
import org.springframework.data.domain.Pageable;

public interface LeaveAvailabilityService {
    EligibilityResponseDTO checkEligibilityForYearlyLeaveAndFlight(User user);

    YearEligibilityResponseDTO checkEligibility();

    PagedResponseDTO<EmployeeLeaveEligibilityResponseDTO> getListEmployee(String searchKeyword, String status, String sortBy, String sortOrder, Pageable pageable);
}
