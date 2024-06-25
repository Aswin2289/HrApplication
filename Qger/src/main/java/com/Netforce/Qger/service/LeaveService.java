package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.LeaveType;
import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveTypeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface LeaveService {

  void addLeaveType(LeaveTypeRequestDTO leaveTypeRequestDTO);
  List<LeaveType>getAllLeaveTypes();
  List<LeaveType>getAllLeaveTypesHr();
  void applyLeave(LeaveRequestDTO leaveRequestDTO);
  void addLeaveHR(LeaveUpdateDTO leaveUpdateDTO);

  PagedResponseDTO<LeavePendingResponseDTO>getLeavePendingResponse(Integer page, Integer size, String sort, String order,byte[] status,byte transactionType);
  PagedResponseDTO<LeavePendingResponseDTO>getAllForHrLeavePendingResponse(Integer page, Integer size, String sort, String order,byte[] status,byte[] department);
  void rejectLeaveRequest(Integer id);
  void acceptLeaveRequest(Integer id);
  void deleteLeaveRequest(Integer id);
  ResponseEntity<Object>leaveCountDisplay();
  void adminRejectLeaveRequest(Integer id);
  void adminAcceptLeaveRequest(Integer id);
  void adminDeleteLeaveRequest(Integer id);
  void rejectAcceptedLeaveRequest(Integer id);



}
