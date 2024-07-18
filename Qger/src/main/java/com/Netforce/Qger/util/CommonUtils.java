package com.Netforce.Qger.util;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.security.SecurityUtils;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CommonUtils {

  private final UserRepository userRepository;
  private final MessageSource messageSource;
  private final LeaveRepository leaveRepository;

  private final byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
  private final byte[] leaveStatus = {
    Leave.Status.ACCEPTED_BY_HR.value, Leave.Status.ACCEPTED.value
  };
  private final byte[] leaveAddedStatus = {Leave.Status.ADDED.value};
  private final Integer[] userRole = {1, 2,4,5};
  private final Integer[] adminRole = { 1};
  private final Integer[] hodRole = { 4};

  private final Integer[] userRoleCheck = {3};
  private final Integer[] userAllRoleCheck = {1, 2, 3 ,4,5};

  public UserDetails getCurrentUser() {
    return SecurityUtils.getCurrentUserDetails();
  }

  public long calculateDaysDifference(LocalDate startDate, LocalDate endDate) {
    return ChronoUnit.DAYS.between(startDate, endDate);
  }

  public void validateHR() {
    UserDetails currentUser = getCurrentUser();
    if (currentUser != null) {
      String username = currentUser.getUsername();
      User user =
          userRepository
              .findByEmployeeIdAndStatusInAndRoleIdIn(username, userStatus, userRole)
              .orElseThrow(
                  () ->
                      new BadRequestException(
                          messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH)));
    }
  }
  public void validateAdmin() {
    UserDetails currentUser = getCurrentUser();
    if (currentUser != null) {
      String username = currentUser.getUsername();
      User user =
              userRepository
                      .findByEmployeeIdAndStatusInAndRoleIdIn(username, userStatus, adminRole)
                      .orElseThrow(
                              () ->
                                      new BadRequestException(
                                              messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH)));
    }
  }
  public void validateHod() {
    UserDetails currentUser = getCurrentUser();
    if (currentUser != null) {
      String username = currentUser.getUsername();
      User user =
              userRepository
                      .findByEmployeeIdAndStatusInAndRoleIdIn(username, userStatus, hodRole)
                      .orElseThrow(
                              () ->
                                      new BadRequestException(
                                              messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH)));
    }
  }

  public User validateUser() {
    UserDetails currentUser = getCurrentUser();
    if (currentUser == null) {
      // If current user is null, return null user
      throw new BadRequestException(
          messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
    } else {
      String username = currentUser.getUsername();
      User user =
          userRepository
              .findByEmployeeIdAndStatusInAndRoleIdIn(username, userStatus, userRoleCheck)
              .orElseThrow(
                  () ->
                      new BadRequestException(
                          messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH)));
      return user;
    }
  }

  public User validateAllUser() {
    UserDetails currentUser = getCurrentUser();
    if (currentUser == null) {
      // If current user is null, return null user
      throw new BadRequestException(
          messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
    } else {
      String username = currentUser.getUsername();
      User user =
          userRepository
              .findByEmployeeIdAndStatusInAndRoleIdIn(username, userStatus, userAllRoleCheck)
              .orElseThrow(
                  () ->
                      new BadRequestException(
                          messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH)));
      return user;
    }
  }

  public int getTotalLeaveAdded(User user) {
    List<Leave> leaves =
        leaveRepository.findByUserAndTransactionTypeAndStatusIn(
            user, Leave.TransactionType.ADDED.value, leaveAddedStatus);
    return leaves.stream()
        .mapToInt(leave -> leave.getDaysAdjusted() != null ? leave.getDaysAdjusted() : 0)
        .sum();
  }

  public int getTotalLeaveTaken(User user) {
    List<Leave> leaves =
        leaveRepository.findByUserAndTransactionTypeAndStatusIn(
            user, Leave.TransactionType.SUBTRACT.value, leaveStatus);

    return leaves.stream()
        .mapToInt(
            leave ->
                Math.toIntExact(
                    ChronoUnit.DAYS.between(leave.getLeaveFrom(), leave.getLeaveTo()) + 1))
        .sum();
  }

  public int getTotalLeaveAddedPerYear(User user, Integer leaveTypeId) {
    int currentYear = Year.now().getValue();

    List<Leave> leaves = leaveRepository.findByUserAndTransactionTypeAndStatusInAndLeaveTypeId(
            user, Leave.TransactionType.ADDED.value, leaveAddedStatus, leaveTypeId);

    return leaves.stream()
            .filter(leave -> leave.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getYear() == currentYear)
            .mapToInt(leave -> leave.getDaysAdjusted() != null ? leave.getDaysAdjusted() : 0)
            .sum();
  }

  public int getTotalLeaveTakenPerYear(User user, Integer leaveTypeId) {
    int currentYear = Year.now().getValue();

    List<Leave> leaves = leaveRepository.findByUserAndTransactionTypeAndStatusInAndLeaveTypeId(
            user, Leave.TransactionType.SUBTRACT.value, leaveStatus, leaveTypeId);

    return leaves.stream()
            .filter(leave -> leave.getCreatedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate().getYear() == currentYear)
            .mapToInt(leave -> Math.toIntExact(ChronoUnit.DAYS.between(leave.getLeaveFrom(), leave.getLeaveTo()) + 1))
            .sum();
  }

  public long check10YearExp(Date joiningDate) {
    LocalDate currentDate = LocalDate.now();
    LocalDate joiningDateFormatted = convertToLocalDate(joiningDate);
    return ChronoUnit.DAYS.between(joiningDateFormatted, currentDate);
  }

  public LocalDate convertToLocalDate(Date date) {
    if (date == null) {
      throw new IllegalArgumentException("The date cannot be null");
    }
    return date.toInstant()
            .atZone(ZoneId.systemDefault())
            .toLocalDate();
  }
  public int getTotalLeaveTaken(User user, List<Long> leaveTypeIds, byte transactionType, byte status) {
    List<Leave> leaves = leaveRepository.findLeavesByCriteria(user, leaveTypeIds, transactionType, status);
    return leaves.stream().mapToInt(Leave::getDaysAdjusted).sum();
  }

//  public boolean isTimeToAddLeaveDays() {
//    LocalDate currentDate = LocalDate.now();
//    return currentDate.getDayOfMonth() == 1;
//  }
//public boolean isTimeToAddLeaveDays(User user) {
//  LocalDate currentDate = LocalDate.now();
//  LocalDate joiningDate = user.getJoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
//  LocalDate rejoiningDate = user.getRejoiningDate() != null ? user.getRejoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null;
//
//  // Calculate the anniversary date of joining or rejoining
//  LocalDate anniversaryDate = joiningDate.withYear(currentDate.getYear());
//  if (rejoiningDate != null && rejoiningDate.isAfter(joiningDate)) {
//    anniversaryDate = rejoiningDate.withYear(currentDate.getYear());
//  }
//
//  return currentDate.isEqual(anniversaryDate);
//}
  public boolean isTimeToAddLeaveDays(User user, List<Leave> leaves) {
    LocalDate currentDate = LocalDate.now();
    LocalDate joiningDate = user.getJoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    LocalDate rejoiningDate = user.getRejoiningDate() != null
            ? user.getRejoiningDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()
            : null;

    // Calculate the anniversary date of joining or rejoining
    LocalDate anniversaryDate = joiningDate.withYear(currentDate.getYear());
    if (rejoiningDate != null && rejoiningDate.isAfter(joiningDate)) {
      anniversaryDate = rejoiningDate.withYear(currentDate.getYear());
    }

    if (!currentDate.isEqual(anniversaryDate)) {
      return false;
    }

    // Check if the user is currently on leave
    for (Leave leave : leaves) {
      if (leave.getUser().equals(user) && leave.getStatus() == Leave.Status.ACCEPTED.value) {
        LocalDate leaveFrom = leave.getLeaveFrom();
        LocalDate leaveTo = leave.getLeaveTo();
        if ((currentDate.isEqual(leaveFrom) || currentDate.isAfter(leaveFrom))
                && (currentDate.isEqual(leaveTo) || currentDate.isBefore(leaveTo))) {
          return false;
        }
      }
    }

    // Check if the user has worked a full month since the last leave
    LocalDate lastLeaveEndDate = null;
    for (Leave leave : leaves) {
      if (leave.getUser().equals(user) && leave.getStatus() == Leave.Status.ACCEPTED.value
              && (leave.getLeaveType().getId() == 1 || leave.getLeaveType().getId() == 4)) {
        LocalDate leaveTo = leave.getLeaveTo();
        if (lastLeaveEndDate == null || leaveTo.isAfter(lastLeaveEndDate)) {
          lastLeaveEndDate = leaveTo;
        }
      }
    }

    if (lastLeaveEndDate != null && lastLeaveEndDate.plusMonths(1).isAfter(currentDate)) {
      return false;
    }

    return true;
  }

}
