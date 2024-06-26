package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.service.SchedulerService;
import com.Netforce.Qger.util.CommonUtils;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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
  public void updateYearStatusUpdateScheduler() {
    System.out.println("Executing scheduled task...");
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
  public void addYearlyLeaveDaysScheduler() {
    System.out.println("Executing yearly leave addition task...");
    List<User> users = userRepository.findAllByStatusIn(userStatus);
    byte[] status={Leave.Status.ACCEPTED.value};
    byte transaction=Leave.TransactionType.SUBTRACT.value;
    List<Long> leaveTypeIds = Arrays.asList(1L, 2L);
    for (User user : users) {
      List<Leave> leaves = leaveRepository.findByUserAndStatusInAndTransactionTypeAndLeaveTypeIdIn(user,status,transaction,leaveTypeIds); // Assuming leaveRepository is available
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
  public void updateUserStatuses() {
    LocalDate currentDate = LocalDate.now();
    byte acceptedStatus = Leave.Status.ACCEPTED.value;

    // Fetch all users
    List<User> users = userRepository.findAllByStatusIn(userStatus);

    for (User user : users) {
      List<Leave> currentLeaves =
          leaveRepository.findByUserAndLeaveFromLessThanEqualAndLeaveToGreaterThanEqualAndStatus(
              user, currentDate, currentDate, acceptedStatus);

      if (currentLeaves.isEmpty()) {
        user.setStatus(User.Status.ACTIVE.value);
      } else {
        user.setStatus(User.Status.VACATION.value);
      }
      userRepository.save(user);
    }
  }
}
