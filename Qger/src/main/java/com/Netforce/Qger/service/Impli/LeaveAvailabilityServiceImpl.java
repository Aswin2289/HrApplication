package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.*;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.UserCriteriaRepository;
import com.Netforce.Qger.service.LeaveAvailabilityService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveAvailabilityServiceImpl implements LeaveAvailabilityService {

    private final LeaveRepository leaveRepository;
    private final CommonUtils commonUtils;
    private final UserCriteriaRepository userCriteriaRepository;
//    @Override
//    public EligibilityResponseDTO checkEligibilityForYearlyLeaveAndFlight(User user) {
//
////        User user = commonUtils.validateAllUser();
//        LocalDate currentDate = LocalDate.now();
//
//        // Determine the eligibility period based on yearStatus
//        int eligibilityPeriodYears = user.getYearStatus() == 0 ? 1 : 2;
//
//        // Use rejoiningDate if available, otherwise use joiningDate
//        LocalDate relevantJoiningDate = (user.getLastEligilibleDate() != null)
//                ? user.getLastEligilibleDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
//                : user.getJoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//
//        // Calculate the period to consider for eligibility check
//        LocalDate eligibilityStartDate = relevantJoiningDate.isAfter(currentDate.minusYears(eligibilityPeriodYears))
//                ? relevantJoiningDate
//                : currentDate.minusYears(eligibilityPeriodYears);
//
//        System.out.println("----------->"+eligibilityStartDate);
//        // Calculate the number of days the user has been in the company since the eligibility start date
//        long daysInCompany = ChronoUnit.DAYS.between(eligibilityStartDate, currentDate);
//
//        // List of relevant leave type IDs (e.g., 1 for casual leave, 2 for sick leave, 4 for leave without pay)
//        List<Long> relevantLeaveTypeIds = Arrays.asList(1L,3L, 4L);
//
//        // List of relevant leave statuses (e.g., 0 for accepted)
//        List<Byte> relevantStatuses = List.of((byte) 0);
//
//        // Get all relevant leaves taken since the eligibility start date
//        List<Leave> relevantLeaves = leaveRepository.findByUserAndLeaveTypeIdInAndLeaveFromAfterAndStatusIn(
//                user, relevantLeaveTypeIds, eligibilityStartDate, relevantStatuses);
//
//        // Calculate the total number of leave days
//        int totalLeaveDays = relevantLeaves.stream().mapToInt(Leave::getDaysAdjusted).sum();
//
//        System.out.println("+++++++++"+totalLeaveDays);
//        // Calculate the total days considered for eligibility
//        long totalDaysConsidered = daysInCompany - totalLeaveDays;
//        System.out.println("daysInCompany--------"+daysInCompany);
//        // Determine the eligibility based on the eligibility period
//        long requiredDays = eligibilityPeriodYears * 365;
//        boolean isEligible = totalDaysConsidered >= requiredDays;
//
//        long daysLeft = isEligible ? 0 : (requiredDays - totalDaysConsidered);
//
//
//        // Adjust the eligibility date by adding the total leave days
//        LocalDate eligibilityDate = currentDate.plusDays(daysLeft);
//        LocalDate sixMonthsBeforeEligibilityDate = eligibilityDate.minusMonths(6);
//
//        boolean applyEligibility = !currentDate.isBefore(sixMonthsBeforeEligibilityDate) && !currentDate.isAfter(eligibilityDate);
//        return new EligibilityResponseDTO(isEligible, daysLeft, eligibilityDate,applyEligibility,totalDaysConsidered);
//    }

    @Override
    public EligibilityResponseDTO checkEligibilityForYearlyLeaveAndFlight(User user) {
        LocalDate currentDate = LocalDate.now();
        int eligibilityPeriodYears = user.getYearStatus() == 0 ? 1 : 2;
        // Use lastEligibleDate if available, otherwise use joiningDate
        LocalDate relevantJoiningDate = (user.getLastEligilibleDate() != null)
                ? user.getLastEligilibleDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
                : user.getJoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        // The date when the user should be eligible without considering leaves
        LocalDate baseEligibilityDate = relevantJoiningDate.plusYears(eligibilityPeriodYears);

        // List of relevant leave type IDs (e.g., 1 for casual leave, 3 for sick leave, 4 for leave without pay)
        List<Long> relevantLeaveTypeIds = Arrays.asList(1L, 3L, 4L);

        // List of relevant leave statuses (e.g., 0 for accepted)
        List<Byte> relevantStatuses = List.of((byte) 0);

        // Get all relevant leaves taken after the last eligible date
        List<Leave> relevantLeaves = leaveRepository.findByUserAndLeaveTypeIdInAndLeaveFromAfterAndStatusIn(
                user, relevantLeaveTypeIds, relevantJoiningDate, relevantStatuses);

        // Calculate the total number of leave days
        int totalLeaveDays = relevantLeaves.stream().mapToInt(Leave::getDaysAdjusted).sum();

        // Calculate the adjusted eligibility date
        LocalDate adjustedEligibilityDate = baseEligibilityDate.plusDays(totalLeaveDays);

        // Determine if the user is eligible
        boolean isEligible = !currentDate.isBefore(adjustedEligibilityDate);

        // Calculate the days left until eligibility
        long daysLeft = ChronoUnit.DAYS.between(currentDate, adjustedEligibilityDate);
        daysLeft = daysLeft > 0 ? daysLeft : 0;

        // Consider the date six months before the adjusted eligibility date
        LocalDate sixMonthsBeforeEligibilityDate = adjustedEligibilityDate.minusMonths(6);

        // Determine if the user can apply for eligibility
        boolean applyEligibility = !currentDate.isBefore(sixMonthsBeforeEligibilityDate) && !currentDate.isAfter(adjustedEligibilityDate);

        return new EligibilityResponseDTO(isEligible, daysLeft, adjustedEligibilityDate, applyEligibility, ChronoUnit.DAYS.between(relevantJoiningDate, currentDate));
    }

    @Override
    public YearEligibilityResponseDTO checkEligibility(){
        User user = commonUtils.validateAllUser();
        YearEligibilityResponseDTO result = new YearEligibilityResponseDTO();
        result.setEligibleYears(user.getYearStatus());
        return result;
    }

    @Override
    public PagedResponseDTO<EmployeeLeaveEligibilityResponseDTO>getListEmployee(String searchKeyword, String status, String sortBy, String sortOrder, Pageable pageable){
        boolean qidExpiresThisMonth=false;
        boolean passportExpired=false;
        boolean licenseExpired=false;
        Page<User> userPage =
                userCriteriaRepository.getUsersWithFilters(
                        searchKeyword,
                        status,
                        qidExpiresThisMonth,
                        passportExpired,
                        licenseExpired,
                        sortBy,
                        sortOrder,
                        pageable);

        List<EmployeeLeaveEligibilityResponseDTO>eligibilityResponseDTOS=userPage.getContent().stream()
                .map(user -> {
                    LocalDate today = LocalDate.now();
                    EligibilityResponseDTO eligibilityResponseDTO=checkEligibilityForYearlyLeaveAndFlight(user);
                    Integer noOfDaysPassport =
                            Math.toIntExact(
                                    commonUtils.calculateDaysDifference(today, user.getPassportExpire()));
                    return new EmployeeLeaveEligibilityResponseDTO(
                            Math.toIntExact(user.getId()),
                            user.getEmployeeId(),
                            user.getName(),
                            user.getPassportExpire(),
                            noOfDaysPassport,
                            eligibilityResponseDTO
                          );
                })
                .collect(Collectors.toList());

        return new PagedResponseDTO<>(
                eligibilityResponseDTOS,
                userPage.getTotalPages(),
                userPage.getTotalElements(),
                userPage.getNumber());
    }
}
