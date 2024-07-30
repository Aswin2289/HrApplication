package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.SuccessResponseDTO;
import com.Netforce.Qger.service.LeaveApplicationService;
import com.Netforce.Qger.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leaveApplication")
@RequiredArgsConstructor
public class ApplicationController {

  private final LeaveApplicationService leaveApplicationService;
  private final LeaveService leaveService;

  @PostMapping("/add")
  public ResponseEntity<Object> addLeaveApplication(
      @RequestBody @Valid LeaveRequestDTO leaveRequestDTO) {
    leaveApplicationService.addLeaveApplication(leaveRequestDTO);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Leave Application Submitted"), HttpStatus.CREATED);
  }

  @GetMapping("/listApplication")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getPendingLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {
      Leave.Status.APPLICATION_PENDING.value, Leave.Status.APPLICATION_APPROVED.value,Leave.Status.APPLICATION_RESCHEDULED.value
    };
    byte transactionType = Leave.TransactionType.APPLICATION.value;
    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getLeavePendingResponse(
            page, size, sortBy, sortOrder, status, transactionType);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @PutMapping("/delete/{id}")
  public ResponseEntity<Object> deleteLeave(@PathVariable("id") Integer id) {
    leaveApplicationService.deleteLeaveApplication(id);
    return new ResponseEntity<>(
            new SuccessResponseDTO("201", "Employee Leave Application Deleted"), HttpStatus.CREATED);
  }
  @PutMapping("/update/{id}")
  public ResponseEntity<Object> updateLeaveApplicationHR(@PathVariable("id") Integer id,
          @RequestBody @Valid LeaveRequestDTO leaveRequestDTO) {
    leaveApplicationService.updateLeaveApplication(id,leaveRequestDTO);
    return new ResponseEntity<>(
            new SuccessResponseDTO("201", "Leave Application Updated"), HttpStatus.CREATED);
  }
}
