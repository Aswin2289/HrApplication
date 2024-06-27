package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.YearEligibilityResponseDTO;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.service.LeaveAvailabilityService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveAvailabilityServiceImpl implements LeaveAvailabilityService {

    private final LeaveRepository leaveRepository;
    private final CommonUtils commonUtils;
    @Override
    public EligibilityResponseDTO checkEligibilityForYearlyLeaveAndFlight(User user) {

//        User user = commonUtils.validateAllUser();
        LocalDate currentDate = LocalDate.now();

        // Determine the eligibility period based on yearStatus
        int eligibilityPeriodYears = user.getYearStatus() == 0 ? 1 : 2;

        // Use rejoiningDate if available, otherwise use joiningDate
        LocalDate relevantJoiningDate = (user.getRejoiningDate() != null)
                ? user.getRejoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                : user.getJoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        // Calculate the period to consider for eligibility check
        LocalDate eligibilityStartDate = relevantJoiningDate.isAfter(currentDate.minusYears(eligibilityPeriodYears))
                ? relevantJoiningDate
                : currentDate.minusYears(eligibilityPeriodYears);

        // Calculate the number of days the user has been in the company since the eligibility start date
        long daysInCompany = ChronoUnit.DAYS.between(eligibilityStartDate, currentDate);

        // List of relevant leave type IDs (e.g., 1 for casual leave, 2 for sick leave, 4 for leave without pay)
        List<Long> relevantLeaveTypeIds = Arrays.asList(1L,3L, 4L);

        // List of relevant leave statuses (e.g., 0 for accepted)
        List<Byte> relevantStatuses = List.of((byte) 0);

        // Get all relevant leaves taken since the eligibility start date
        List<Leave> relevantLeaves = leaveRepository.findByUserAndLeaveTypeIdInAndLeaveFromAfterAndStatusIn(
                user, relevantLeaveTypeIds, eligibilityStartDate, relevantStatuses);

        // Calculate the total number of leave days
        int totalLeaveDays = relevantLeaves.stream().mapToInt(Leave::getDaysAdjusted).sum();

        // Calculate the total days considered for eligibility
        long totalDaysConsidered = daysInCompany + totalLeaveDays;

        // Determine the eligibility based on the eligibility period
        long requiredDays = eligibilityPeriodYears * 365;
        boolean isEligible = totalDaysConsidered >= requiredDays;
        long daysLeft = isEligible ? 0 : (requiredDays - totalDaysConsidered);

        // Adjust the eligibility date by adding the total leave days
        LocalDate eligibilityDate = currentDate.plusDays(daysLeft + totalLeaveDays);
        LocalDate sixMonthsBeforeEligibilityDate = eligibilityDate.minusMonths(6);

        boolean applyEligibility = !currentDate.isBefore(sixMonthsBeforeEligibilityDate) && !currentDate.isAfter(eligibilityDate);
        return new EligibilityResponseDTO(isEligible, daysLeft, eligibilityDate,applyEligibility);
    }


    @Override
    public YearEligibilityResponseDTO checkEligibility(){
        User user = commonUtils.validateAllUser();
        YearEligibilityResponseDTO result = new YearEligibilityResponseDTO();
        result.setEligibleYears(user.getYearStatus());
        return result;
    }
}
