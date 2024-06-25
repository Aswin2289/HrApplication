package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.LeaveType;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveTypeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.LeaveTypeRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.security.SecurityUtils;
import com.Netforce.Qger.security.TokenManager;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.util.CommonUtils;

import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

  private final CommonUtils commonUtils;
  private final MessageSource messageSource;
  private final TokenManager tokenManager;

  private final UserRepository userRepository;
  private final LeaveRepository leaveRepository;
  private final LeaveTypeRepository leaveTypeRepository;
  private final byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
  private final Integer[] userRoleCheck = {3};

  @Override
  public void addLeaveType(LeaveTypeRequestDTO leaveTypeRequestDTO) throws BadRequestException {
    commonUtils.validateHR();
    leaveTypeRepository.save(new LeaveType(leaveTypeRequestDTO));
  }

  @Override
  public List<LeaveType> getAllLeaveTypes() {
    User user = commonUtils.validateAllUser();
    int eligibleYears = user.getYearStatus();

    List<LeaveType> leaveTypes = leaveTypeRepository.findAllByStatusOrderByOrderCount(LeaveType.Status.ACTIVE.value);

    // Filter leave types based on eligibleYears using ids
    return new ArrayList<>(leaveTypes);
  }
  @Override
  public List<LeaveType> getAllLeaveTypesHr() {
    User user = commonUtils.validateAllUser();
    int eligibleYears = user.getYearStatus();

    List<LeaveType> leaveTypes = leaveTypeRepository.findAllByStatusOrderByOrderCount(LeaveType.Status.ACTIVE.value);

    // Filter leave types based on eligibleYears using ids
    return leaveTypes;
  }


  @Override
  public void applyLeave(LeaveRequestDTO leaveRequestDTO) {

    if (leaveRequestDTO.getTo().isBefore(leaveRequestDTO.getFrom())) {
      throw new BadRequestException(
          messageSource.getMessage("FROM_TO_DATE_ERROR", null, Locale.ENGLISH));
    }
    long dateDiff =
        commonUtils.calculateDaysDifference(leaveRequestDTO.getFrom(), leaveRequestDTO.getTo());
    if (dateDiff > 90 || dateDiff < 0) {
      throw new BadRequestException(
          messageSource.getMessage("LEAVE_DATE_ERROR", null, Locale.ENGLISH));
    }

    User user =
        userRepository
            .findByEmployeeIdAndStatusIn(String.valueOf(leaveRequestDTO.getUser()), userStatus)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

    LeaveType leaveType =
        leaveTypeRepository
            .findByIdAndStatus(leaveRequestDTO.getLeaveType(), LeaveType.Status.ACTIVE.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("LEAVE_TYPE_ERROR", null, Locale.ENGLISH)));

    if (leaveRequestDTO.getLeaveType() == 1) {
      if (user.getYearStatus() != User.YearStatus.TEN.value) {
        throw new BadRequestException(
            messageSource.getMessage("LEAVE_CANT_BE_APPLIED", null, Locale.ENGLISH));
      } else {
        leaveRequestDTO.setTransactionType(Leave.TransactionType.SUBTRACT.value);
        if (getAvailableLeave(user) > 0) {
          leaveRequestDTO.setStatus(Leave.Status.PENDING.value);
          leaveRepository.save(new Leave(leaveRequestDTO, user, leaveType));
        } else {
          throw new BadRequestException(
              messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
        }
      }
    } else if (leaveRequestDTO.getLeaveType() == 6) {
      if (user.getYearStatus() != User.YearStatus.TWO.value) {
        throw new BadRequestException(
            messageSource.getMessage("LEAVE_CANT_BE_APPLIED", null, Locale.ENGLISH));
      } else {
        leaveRequestDTO.setTransactionType(Leave.TransactionType.SUBTRACT.value);
        if (getAvailableLeave(user) > 0) {
          leaveRequestDTO.setStatus(Leave.Status.PENDING.value);
          leaveRepository.save(new Leave(leaveRequestDTO, user, leaveType));
        } else {
          throw new BadRequestException(
              messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
        }
      }
    }

    leaveRequestDTO.setTransactionType(Leave.TransactionType.SUBTRACT.value);
    if (getAvailableLeave(user) > 0) {
        leaveRequestDTO.setStatus(Leave.Status.PENDING.value);
            leaveRepository.save(new Leave(leaveRequestDTO, user, leaveType));
    } else {
      throw new BadRequestException(
          messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
    }
  }

  public UserDetails getCurrentUser() {
    return SecurityUtils.getCurrentUserDetails();
  }

  @Override
  public PagedResponseDTO<LeavePendingResponseDTO> getLeavePendingResponse(
      Integer page, Integer size, String sort, String order, byte[] status,byte transactionType) {

    boolean orderD = !order.equalsIgnoreCase("asc");
    User user = commonUtils.validateAllUser();
    if (user == null) {
      throw new BadRequestException(
          messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH));
    }
    page = Math.max(page, 1);
    Pageable pageable =
        PageRequest.of(page - 1, size, (orderD) ? Sort.Direction.DESC : Sort.Direction.ASC, sort);
    Page<Leave> leavePage =
        leaveRepository.findByUserAndStatusInAndTransactionType(
            user, status, transactionType, pageable);

    List<LeavePendingResponseDTO> pendingResponses =
        leavePage.getContent().stream()
            .map(
                leave -> {
                  LeavePendingResponseDTO dto = new LeavePendingResponseDTO();
                  dto.setId(leave.getId());
                  dto.setLeaveType(leave.getLeaveType().getName());
                  dto.setFrom(leave.getLeaveFrom());
                  dto.setTo(leave.getLeaveTo());
                  dto.setReason(leave.getReason());
                  dto.setStatus(leave.getStatus());
                  Integer availableLeave = getAvailableLeave(leave.getUser());
                  dto.setAvailableLeaveBalance(availableLeave);
                  return dto;
                })
            .collect(Collectors.toList());

    return new PagedResponseDTO<>(
        pendingResponses, leavePage.getTotalPages(), leavePage.getTotalElements(), page);
  }

  @Override
  public void addLeaveHR(LeaveUpdateDTO leaveUpdateDTO) {
    commonUtils.validateHR();
    User user =
        userRepository
            .findByIdAndStatusIn(leaveUpdateDTO.getUser(), userStatus)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

    LeaveType leaveType =
        leaveTypeRepository
            .findByIdAndStatus(leaveUpdateDTO.getLeaveType(), LeaveType.Status.ACTIVE.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("LEAVE_TYPE_ERROR", null, Locale.ENGLISH)));
    leaveUpdateDTO.setTransactionType(Leave.TransactionType.ADDED.value);
    leaveRepository.save(new Leave(leaveUpdateDTO, user, leaveType));
  }

  @Override
  public PagedResponseDTO<LeavePendingResponseDTO> getAllForHrLeavePendingResponse(
      Integer page, Integer size, String sort, String order, byte[] status,byte[] department) {

    boolean orderD = !order.equalsIgnoreCase("asc");
    User user = commonUtils.validateAllUser();
    if (user == null) {
      throw new BadRequestException(
          messageSource.getMessage("ACCESS_DENIED", null, Locale.ENGLISH));
    }
    page = Math.max(page, 1);
    Pageable pageable =
        PageRequest.of(page - 1, size, (orderD) ? Sort.Direction.DESC : Sort.Direction.ASC, sort);
    Page<Leave> leavePage =
        leaveRepository.findAllByStatusInAndTransactionTypeAndUserDepartmentIn(
            status, Leave.TransactionType.SUBTRACT.value,department, pageable);

    List<LeavePendingResponseDTO> pendingResponses =
        leavePage.getContent().stream()
            .map(
                leave -> {
                  LeavePendingResponseDTO dto = new LeavePendingResponseDTO();
                  dto.setId(leave.getId());
                  dto.setLeaveType(leave.getLeaveType().getName());
                  dto.setFrom(leave.getLeaveFrom());
                  dto.setTo(leave.getLeaveTo());
                  dto.setReason(leave.getReason());
                  dto.setStatus(leave.getStatus());
                  dto.setName(leave.getUser().getName());
                  Integer availableLeave = getAvailableLeave(leave.getUser());
                  dto.setAvailableLeaveBalance(availableLeave);
                  return dto;
                })
            .collect(Collectors.toList());

    return new PagedResponseDTO<>(
        pendingResponses, leavePage.getTotalPages(), leavePage.getTotalElements(), page);
  }

  @Override
  public void rejectLeaveRequest(Integer id) {
    commonUtils.validateHR();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
        leaveRepository
            .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));
    leave.setStatus(Leave.Status.REJECTED.value);
    leaveRepository.save(leave);
  }
  @Override
  public void rejectAcceptedLeaveRequest(Integer id) {
    commonUtils.validateHR();
    byte status = Leave.Status.ACCEPTED.value;
    Leave leave =
            leaveRepository
                    .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));
    leave.setStatus(Leave.Status.REJECTED.value);
    leaveRepository.save(leave);
  }

  @Override
  public void acceptLeaveRequest(Integer id) {
    commonUtils.validateHR();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
        leaveRepository
            .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));
    byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
    Integer userId = Math.toIntExact(leave.getUser().getId());
    User user =
        userRepository
            .findByIdAndStatusIn(userId, userStatus)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));
    if (getAvailableLeave(user) >= leave.getDaysAdjusted()) {
      leave.setStatus(Leave.Status.ACCEPTED_BY_HR.value);
      leaveRepository.save(leave);
    } else {
      throw new BadRequestException(
          messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
    }
  }

  @Override
  public void deleteLeaveRequest(Integer id) {
    commonUtils.validateHR();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
        leaveRepository
            .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));

    leave.setStatus(Leave.Status.DELETED.value);
    leaveRepository.save(leave);
  }

  @Override
  public ResponseEntity<Object> leaveCountDisplay() {
    User user = commonUtils.validateAllUser();
    if (user == null) {
      throw new BadRequestException(
          messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH));
    }
    List<LeaveType> leaveTypes =
        leaveTypeRepository.findAllByStatusOrderByOrderCount(LeaveType.Status.ACTIVE.value);

    // Prepare a map to hold the leave counts for each type
    Map<String, Map<String, Integer>> leaveCounts = new HashMap<>();

    for (LeaveType leaveType : leaveTypes) {
      int totalLeaveAddedPerYear =
          commonUtils.getTotalLeaveAddedPerYear(user, Math.toIntExact(leaveType.getId()));
      int totalLeaveTakenPerYear =
          commonUtils.getTotalLeaveTakenPerYear(user, Math.toIntExact(leaveType.getId()));

      Map<String, Integer> counts = new HashMap<>();
      counts.put("totalLeaveAddedPerYear", totalLeaveAddedPerYear);
      counts.put("totalLeaveTakenPerYear", totalLeaveTakenPerYear);
      counts.put("totalLeave", leaveType.getTotalLeave());
      counts.put("orderCount", leaveType.getOrderCount());
      leaveCounts.put(leaveType.getName(), counts);
    }

    return new ResponseEntity<>(leaveCounts, HttpStatus.OK);
  }

  public int getAvailableLeave(User user) {
    int totalLeaveAdded = commonUtils.getTotalLeaveAdded(user);
    int totalLeaveTaken = commonUtils.getTotalLeaveTaken(user);

    return totalLeaveAdded - totalLeaveTaken;
  }

  @Override
  public void adminRejectLeaveRequest(Integer id) {
    commonUtils.validateAdmin();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
            leaveRepository
                    .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));
    leave.setStatus(Leave.Status.REJECTED.value);
    leaveRepository.save(leave);
  }

  @Override
  public void adminAcceptLeaveRequest(Integer id) {
    commonUtils.validateAdmin();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
            leaveRepository
                    .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));
    byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
    Integer userId = Math.toIntExact(leave.getUser().getId());
    User user =
            userRepository
                    .findByIdAndStatusIn(userId, userStatus)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));
    if (getAvailableLeave(user) >= leave.getDaysAdjusted()) {
      leave.setStatus(Leave.Status.ACCEPTED.value);
      leaveRepository.save(leave);
    } else {
      throw new BadRequestException(
              messageSource.getMessage("INSUFFICIENT_LEAVE_BALANCE", null, Locale.ENGLISH));
    }
  }

  @Override
  public void adminDeleteLeaveRequest(Integer id) {
    commonUtils.validateAdmin();
    byte status = Leave.Status.PENDING.value;
    Leave leave =
            leaveRepository
                    .findByIdAndStatusAndTransactionType(id, status, Leave.TransactionType.SUBTRACT.value)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));

    leave.setStatus(Leave.Status.DELETED.value);
    leaveRepository.save(leave);
  }
}
