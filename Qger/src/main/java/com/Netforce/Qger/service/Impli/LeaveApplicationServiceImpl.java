package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.LeaveType;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.responseDto.EligibilityResponseDTO;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.LeaveRepository;
import com.Netforce.Qger.repository.LeaveTypeRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.service.LeaveApplicationService;
import com.Netforce.Qger.service.LeaveAvailabilityService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class LeaveApplicationServiceImpl implements LeaveApplicationService {


    private final LeaveRepository leaveRepository;
    private final CommonUtils commonUtils;
    private final MessageSource messageSource;
    private final UserRepository userRepository;
    private final LeaveTypeRepository leaveTypeRepository;

    private final LeaveAvailabilityService leaveAvailabilityService;

    private final byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};


    @Override
    public void addLeaveApplication(LeaveRequestDTO leaveRequestDTO){
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


        EligibilityResponseDTO eligibilityResponseDTO=leaveAvailabilityService.checkEligibilityForYearlyLeaveAndFlight(user);
        if (!eligibilityResponseDTO.isApplyEligibility()){
            throw new BadRequestException(
                    messageSource.getMessage("ELIGIBILITY_ERROR", null, Locale.ENGLISH));
        }
        if (leaveType.getId() != 1) {
            throw new BadRequestException(messageSource.getMessage("LEAVE_TYPE_ERROR", null, Locale.ENGLISH));
        }
    leaveRequestDTO.setStatus(Leave.Status.APPLICATION_PENDING.value);
    leaveRequestDTO.setTransactionType(Leave.TransactionType.APPLICATION.value);
    leaveRepository.save(new Leave(leaveRequestDTO, user, leaveType));
    }

    @Override
    public void deleteLeaveApplication(Integer id) {
//        commonUtils.validateHR();
    byte[] status = {
      Leave.Status.APPLICATION_PENDING.value, Leave.Status.APPLICATION_RESCHEDULED.value
    };
        Leave leave =
                leaveRepository
                        .findByIdAndStatusInAndTransactionType(id, status, Leave.TransactionType.APPLICATION.value)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));

        leave.setStatus(Leave.Status.DELETED.value);
        leaveRepository.save(leave);
    }

    @Override
    public void updateLeaveApplication(Integer id, LeaveRequestDTO leaveRequestDTO) {
        commonUtils.validateHR();
        byte[] status = {
                Leave.Status.APPLICATION_PENDING.value, Leave.Status.APPLICATION_RESCHEDULED.value
        };
        Leave leave =
                leaveRepository
                        .findByIdAndStatusInAndTransactionType(id, status, Leave.TransactionType.APPLICATION.value)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                messageSource.getMessage("LEAVE_NOT_FOUND", null, Locale.ENGLISH)));

        if (leaveRequestDTO.getTo().isBefore(leaveRequestDTO.getFrom())) {
            throw new BadRequestException(
                    messageSource.getMessage("FROM_TO_DATE_ERROR", null, Locale.ENGLISH));
        }
        User user =
                userRepository
                        .findByEmployeeIdAndStatusIn(String.valueOf(leaveRequestDTO.getUser()), userStatus)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));


        EligibilityResponseDTO eligibilityResponseDTO =leaveAvailabilityService.checkEligibilityForYearlyLeaveAndFlight(user);
        if (!eligibilityResponseDTO.isApplyEligibility()){
            throw new BadRequestException(
                    messageSource.getMessage("ELIGIBILITY_ERROR", null, Locale.ENGLISH));

        }
        else {
            leave.setLeaveFrom(leaveRequestDTO.getFrom());
            leave.setLeaveTo(leaveRequestDTO.getTo());
            leaveRepository.save(leave);
        }
    }


}
