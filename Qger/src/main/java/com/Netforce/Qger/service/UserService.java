package com.Netforce.Qger.service;


import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.EmployeeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LoginRequestDTO;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeDetailsResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeHrLeaveDetailDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.UserResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {


    void addUser(EmployeeRequestDTO employeeRequestDTO);
    ResponseEntity<Object> login(LoginRequestDTO loginRequestDTO);
    PagedResponseDTO<UserResponseDTO> getUsersWithFilters(String searchKeyword, String status, boolean qidExpiresThisMonth,boolean passportExpired,boolean licenseExpired, String sortBy,String sortOrder, Pageable pageable);
    void deleteUser(Integer userIds);
    EmployeeDetailsResponseDTO employeeDetails(Integer userIds);

    ResponseEntity<Object>countUsers();

    PagedResponseDTO<EmployeeHrLeaveDetailDTO> getAllEmployeesLeaveDetails(Integer page, Integer size, String sort, String order, String searchKeyword,String status);


}
