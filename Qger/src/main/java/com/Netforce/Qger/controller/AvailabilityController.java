package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.YearEligibilityResponseDTO;
import com.Netforce.Qger.service.LeaveAvailabilityService;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/leave")
@RequiredArgsConstructor
public class AvailabilityController {
    private final LeaveService leaveService;
    private final LeaveAvailabilityService leaveAvailabilityService;

    private final CommonUtils commonUtils;


    @GetMapping("/availability")
    public EligibilityResponseDTO getAvailability(){
        EligibilityResponseDTO eligibilityResponseDTO = new EligibilityResponseDTO();
        User user = commonUtils.validateAllUser();
        eligibilityResponseDTO=leaveAvailabilityService.checkEligibilityForYearlyLeaveAndFlight(user);
        return eligibilityResponseDTO;
    }

    @GetMapping("/eligibility")
    public YearEligibilityResponseDTO getYearEligibility(){

        return leaveAvailabilityService.checkEligibility();
    }
}
