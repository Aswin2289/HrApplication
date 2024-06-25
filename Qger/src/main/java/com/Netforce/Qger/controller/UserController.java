package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.dto.requestDto.EmployeeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LoginRequestDTO;
import com.Netforce.Qger.entity.dto.responseDto.*;
import com.Netforce.Qger.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @PostMapping("/add")
  public ResponseEntity<Object> addUser(@Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {
    userService.addUser(employeeRequestDTO);
    return new ResponseEntity<>(
        new SuccessResponseDTO("201", "Employee Successfully created"), HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public ResponseEntity<Object> loginUser(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
    return userService.login(loginRequestDTO);
  }

  @GetMapping("/employees")
  public ResponseEntity<PagedResponseDTO<UserResponseDTO>> getUsersWithFilters(
      @RequestParam(required = false) String searchKeyword,
      @RequestParam(required = false, defaultValue = "1,2") String status,
      @RequestParam(required = false, defaultValue = "false") boolean qidExpiresThisMonth,
      @RequestParam(required = false, defaultValue = "false") boolean passportExpired,
      @RequestParam(required = false, defaultValue = "false") boolean licenseExpired,
      @RequestParam(required = false, defaultValue = "joiningDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    PagedResponseDTO<UserResponseDTO> response =
        userService.getUsersWithFilters(
            searchKeyword,
            status,
            qidExpiresThisMonth,
            passportExpired,
            licenseExpired,
            sortBy,
            sortOrder,
            pageable);
    return ResponseEntity.ok(response);
  }

  @PutMapping("/delete/{id}")
  public ResponseEntity<Object> deleteUser(@PathVariable("id") Integer id) {
    userService.deleteUser(id);
    return new ResponseEntity<>(
        new SuccessResponseDTO("200", "Employee Successfully deleted"), HttpStatus.OK);
  }

  @GetMapping("/details/{id}")
  public ResponseEntity<EmployeeDetailsResponseDTO> employeeDetails(
      @PathVariable("id") Integer id) {
    EmployeeDetailsResponseDTO employeeDetails = userService.employeeDetails(id);
    return new ResponseEntity<>(employeeDetails, HttpStatus.OK);
  }

  @GetMapping("/leaveDetails")
  public ResponseEntity<PagedResponseDTO<EmployeeHrLeaveDetailDTO>> getAllEmployeesLeaveDetails(
      @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
      @RequestParam(required = false, defaultValue = "asc") String sortOrder,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(required = false) String searchKeyword) {
    String status="1,2";
    PagedResponseDTO<EmployeeHrLeaveDetailDTO> responseDTOPagedResponseDTO =
        userService.getAllEmployeesLeaveDetails(page, size, sortBy, sortOrder, searchKeyword,status);
    return ResponseEntity.ok(responseDTOPagedResponseDTO);
  }
}
