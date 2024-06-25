package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.LeaveType;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveTypeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.SuccessResponseDTO;
import com.Netforce.Qger.service.LeaveService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/leave")
@RequiredArgsConstructor
public class LeaveController {

  private final LeaveService leaveService;

  @PostMapping("/add")
  public ResponseEntity<Object> addLeave(@Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
    leaveService.applyLeave(leaveRequestDTO);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Successfully created"), HttpStatus.CREATED);
  }

  @GetMapping("/pendingLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getPendingLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {
      Leave.Status.PENDING.value,
      Leave.Status.ACCEPTED_BY_HR.value,
      Leave.Status.ACCEPTED_BY_HOD.value
    };
    byte transactionType=Leave.TransactionType.SUBTRACT.value;
    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getLeavePendingResponse(page, size, sortBy, sortOrder, status,transactionType);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @GetMapping("/approvedLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getApprovedLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.ACCEPTED.value};
    byte transactionType=Leave.TransactionType.SUBTRACT.value;

    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getLeavePendingResponse(page, size, sortBy, sortOrder, status,transactionType);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @GetMapping("/rejectedLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getRejectedLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.REJECTED.value, Leave.Status.CANCELLED.value};
    byte transactionType=Leave.TransactionType.SUBTRACT.value;

    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getLeavePendingResponse(page, size, sortBy, sortOrder, status,transactionType);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @PostMapping("/type/add")
  public ResponseEntity<Object> addLeaveType(
      @Valid @RequestBody LeaveTypeRequestDTO leaveTypeRequestDTO) {
    leaveService.addLeaveType(leaveTypeRequestDTO);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Successfully created"), HttpStatus.CREATED);
  }

  @GetMapping("/type/get")
  public List<LeaveType> getAllLeaveType() {
    return leaveService.getAllLeaveTypes();
  }
  @GetMapping("/type/getHr")
  public List<LeaveType> getAllLeaveTypeHr() {
    return leaveService.getAllLeaveTypesHr();
  }

  @PostMapping("/hr/add")
  public ResponseEntity<Object> addLeaveByHr(@Valid @RequestBody LeaveUpdateDTO leaveUpdateDTO) {
    leaveService.addLeaveHR(leaveUpdateDTO);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Successfully Added"), HttpStatus.CREATED);
  }

  @GetMapping("/hr/pendingLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getAllPendingLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.PENDING.value};
    byte[] department ={User.Department.PRODUCTION.value, User.Department.OFFICE.value};

    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getAllForHrLeavePendingResponse(page, size, sortBy, sortOrder, status,department);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @PutMapping("/hr/rejectLeave/{id}")
  public ResponseEntity<Object> rejectLeave(@PathVariable("id") Integer id) {
    leaveService.rejectLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Rejected"), HttpStatus.CREATED);
  }

  @PutMapping("/hr/acceptLeave/{id}")
  public ResponseEntity<Object> acceptLeave(@PathVariable("id") Integer id) {
    leaveService.acceptLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Accepted"), HttpStatus.CREATED);
  }

  @PutMapping("/hr/deleteLeave/{id}")
  public ResponseEntity<Object> deleteLeave(@PathVariable("id") Integer id) {
    leaveService.deleteLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Accepted"), HttpStatus.CREATED);
  }

  @GetMapping("/count")
  public ResponseEntity<Object> getLeaveCount() {
    return new ResponseEntity<>(leaveService.leaveCountDisplay(), HttpStatus.OK);
  }

  @GetMapping("/admin/pendingLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getAllAdminPendingLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.ACCEPTED_BY_HR.value};
    byte[] department ={User.Department.PRODUCTION.value, User.Department.OFFICE.value};

    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getAllForHrLeavePendingResponse(page, size, sortBy, sortOrder, status,department);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }

  @PutMapping("/admin/rejectLeave/{id}")
  public ResponseEntity<Object> adminRejectLeave(@PathVariable("id") Integer id) {
    leaveService.adminRejectLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Rejected"), HttpStatus.CREATED);
  }

  @PutMapping("/admin/acceptLeave/{id}")
  public ResponseEntity<Object> adminAcceptLeave(@PathVariable("id") Integer id) {
    leaveService.adminAcceptLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Accepted"), HttpStatus.CREATED);
  }

  @PutMapping("/admin/deleteLeave/{id}")
  public ResponseEntity<Object> adminDeleteLeave(@PathVariable("id") Integer id) {
    leaveService.adminDeleteLeaveRequest(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Leave Accepted"), HttpStatus.CREATED);
  }

  @GetMapping("/admin/acceptedLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getAllAdminAcceptedLeave(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.ACCEPTED.value};
    byte[] department ={User.Department.PRODUCTION.value, User.Department.OFFICE.value};
    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
        leaveService.getAllForHrLeavePendingResponse(page, size, sortBy, sortOrder, status,department);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }
  @PutMapping("/admin/rejectAcceptedLeave/{id}")
  public ResponseEntity<Object> adminRejectAcceptedLeave(@PathVariable("id") Integer id) {
    leaveService.rejectAcceptedLeaveRequest(id);
    return new ResponseEntity<>(
            new SuccessResponseDTO("201", "Employee Leave Rejected"), HttpStatus.CREATED);
  }

  @GetMapping("/hod/pendingLeave")
  public ResponseEntity<PagedResponseDTO<LeavePendingResponseDTO>> getAllPendingLeaveHOD(
          @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
          @RequestParam(required = false, defaultValue = "asc") String sortOrder,
          @RequestParam(defaultValue = "0") int page,
          @RequestParam(defaultValue = "10") int size) {
    byte[] status = {Leave.Status.PENDING.value};
    byte[] department ={User.Department.PRODUCTION.value};
    PagedResponseDTO<LeavePendingResponseDTO> responseDTOPagedResponseDTO =
            leaveService.getAllForHrLeavePendingResponse(page, size, sortBy, sortOrder, status,department);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }
}
