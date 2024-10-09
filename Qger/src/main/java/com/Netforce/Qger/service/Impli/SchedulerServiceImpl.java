package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.service.SchedulerService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerServiceImpl implements SchedulerService {

    private final UserRepository userRepository;
    private final CommonUtils commonUtils;
    private final LeaveService leaveService;
    private final LeaveRepository leaveRepository;
    private final byte[] yearStatus = {User.YearStatus.JUSTJOININED.value, User.YearStatus.TWO.value};
    private final byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};

    //  @Scheduled(cron = "0 */2 * * * *")//every 2 mins

    @Override
    @Scheduled(cron = "0 0 0 * * ?") // every day midnight
//    @Scheduled(cron = "0 */2 * * * *")
    public void updateYearStatusUpdateScheduler() {
        System.out.println("Executing scheduled task....");
        List<User> userList = userRepository.findAllByYearStatusIn(yearStatus);
        for (User user : userList) {
            List<Long> leaveTypeIds = Arrays.asList(1L, 2L);
            byte transactionType = Leave.TransactionType.SUBTRACT.value;
            byte status = Leave.Status.ACCEPTED.value;
            int leaveTaken = commonUtils.getTotalLeaveTaken(user, leaveTypeIds, transactionType, status);
            System.out.println(leaveTaken);
            long currentExp = commonUtils.check10YearExp(user.getJoiningDate());
            System.out.println(currentExp);
            int expExcludingLeave = Math.toIntExact(currentExp - leaveTaken);
            System.out.println(expExcludingLeave);
            if (expExcludingLeave > 3650) {
                user.setYearStatus(User.YearStatus.TEN.value);
            } else if (expExcludingLeave > 730) {
                user.setYearStatus(User.YearStatus.TWO.value);
            } else {
                System.out.println("inside else");
                user.setYearStatus(User.YearStatus.JUSTJOININED.value);
            }
            userRepository.save(user);
        }
    }

    @Override
    @Scheduled(cron = "0 0 0 * * ?") // every day at midnight
//    @Scheduled(cron = "0 */2 * * * *")
    public void addYearlyLeaveDaysScheduler() {
        System.out.println("Executing yearly leave addition task...");
        List<User> users = userRepository.findAllByStatusIn(userStatus);
        byte[] status = {Leave.Status.ACCEPTED.value};
        byte transaction = Leave.TransactionType.SUBTRACT.value;
        List<Long> leaveTypeIds = Arrays.asList(1L, 4L);
        for (User user : users) {
            List<Leave> leaves = leaveRepository.findByUserAndStatusInAndTransactionTypeAndLeaveTypeIdIn(user, status, transaction, leaveTypeIds); // Assuming leaveRepository is available
            if (commonUtils.isTimeToAddLeaveDays(user, leaves)) {
                LeaveUpdateDTO leaveUpdateDTO = new LeaveUpdateDTO();
                leaveUpdateDTO.setUser(Math.toIntExact(user.getId()));
                leaveUpdateDTO.setLeaveType(1); // Assuming 1 is the ID for the leave type
                leaveUpdateDTO.setTransactionType(Leave.TransactionType.ADDED.value);
                leaveUpdateDTO.setDaysUpdated(3); // Add 3 days of leave
                leaveUpdateDTO.setReason("System Generated Leave");
                leaveService.addLeaveHR(leaveUpdateDTO);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") // Runs every day at midnight
//    @Scheduled(cron = "0 */2 * * * *")
    public void updateUserStatuses() {
        LocalDate currentDate = LocalDate.now();
        byte acceptedStatus = Leave.Status.ACCEPTED.value;

        // Fetch all users
        List<User> users = userRepository.findAllByStatusIn(userStatus);

        for (User user : users) {
            List<Leave> currentLeaves = leaveRepository.findByUserAndLeaveFromLessThanEqualAndLeaveToGreaterThanEqualAndStatus(user, currentDate, currentDate, acceptedStatus);

            if (currentLeaves.isEmpty()) {
                user.setStatus(User.Status.ACTIVE.value);
            } else {
                user.setStatus(User.Status.VACATION.value);
            }
            userRepository.save(user);
        }
    }

//    @Scheduled(cron = "0 */2 * * * *") // Runs every 2 minutes (adjust this as needed)
//    @Scheduled(cron = "0 0 0 * * ?")
//    public void updateEligibilityDates() {
//        List<User> users = userRepository.findAll(); // Fetch all users
//
//        for (User user : users) {
//            LocalDate currentDate = LocalDate.now();
//
//            // If lastEligibleDate is null, set it to the current date
//            if (user.getLastEligilibleDate() == null) {
//                user.setLastEligilibleDate(currentDate);  // Set the current date if null
//            }
//
//            LocalDate lastEligibleDate = user.getLastEligilibleDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//
//            // Calculate the eligibility period based on user experience
//            int eligibilityPeriodYears = user.getYearStatus() == 0 ? 1 : 2;
//            LocalDate nextEligibilityDate = lastEligibleDate.plusYears(eligibilityPeriodYears);
//
//            // Fetch leaves taken after the last eligibility date
//            List<Leave> relevantLeaves = leaveRepository.findByUserAndLeaveTypeIdInAndLeaveFromAfterAndStatusIn(user, Arrays.asList(1L, 3L, 4L), lastEligibleDate, List.of((byte) 0));
//
//            // Calculate total leave days taken
//            int totalLeaveDays = relevantLeaves.stream().mapToInt(Leave::getDaysAdjusted).sum();
//
//            // Calculate the adjusted eligibility date
//            LocalDate adjustedEligibilityDate = nextEligibilityDate.plusDays(totalLeaveDays);
//
//            // Update last eligibility date if required
//            if (currentDate.isAfter(nextEligibilityDate)) {
//                // If the user has not taken leave in the last 6 months, update last eligibility date
//                if (currentDate.isAfter(nextEligibilityDate.minusMonths(6))) {
//                    user.setLastEligilibleDate(adjustedEligibilityDate);
//                }
//            }
//
//            // Save the updated user
//            userRepository.save(user);
//        }
//    }
}
