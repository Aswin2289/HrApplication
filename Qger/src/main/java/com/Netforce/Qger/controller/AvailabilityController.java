package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeLeaveEligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.YearEligibilityResponseDTO;
import com.Netforce.Qger.service.LeaveAvailabilityService;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    @GetMapping("/availability/list")
    public ResponseEntity<PagedResponseDTO<EmployeeLeaveEligibilityResponseDTO>>getEligibleEmployee(
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false, defaultValue = "1,2") String status,
            @RequestParam(required = false, defaultValue = "joiningDate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    )
    {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponseDTO<EmployeeLeaveEligibilityResponseDTO>responseDTO=leaveAvailabilityService.getListEmployee(searchKeyword,
                status, sortBy,
                sortOrder,
                pageable);
        return ResponseEntity.ok(responseDTO);

    }
}
