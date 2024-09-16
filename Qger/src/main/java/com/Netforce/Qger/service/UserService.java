package com.Netforce.Qger.service;


import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.requestDto.*;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeDetailsResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.EmployeeHrLeaveDetailDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.UserResponseDTO;
import com.Netforce.Qger.expectionHandler.InvalidUserException;
import com.Netforce.Qger.expectionHandler.UserAuthenticationException;
import com.Netforce.Qger.expectionHandler.UserDisabledException;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {


    void addUser(EmployeeRequestDTO employeeRequestDTO);
    ResponseEntity<Object> login(LoginRequestDTO loginRequestDTO);
    ResponseEntity<Object>refreshToken(RefreshTokenDTO refreshTokenDTO) throws UserDisabledException, InvalidUserException, UserAuthenticationException;
    PagedResponseDTO<UserResponseDTO> getUsersWithFilters(String searchKeyword, String status, boolean qidExpiresThisMonth,boolean passportExpired,boolean licenseExpired, String sortBy,String sortOrder, Pageable pageable);
    void deleteUser(Integer userIds);
    EmployeeDetailsResponseDTO employeeDetails(Integer userIds);

    ResponseEntity<Object>countUsers();

    PagedResponseDTO<EmployeeHrLeaveDetailDTO> getAllEmployeesLeaveDetails(Integer page, Integer size, String sort, String order, String searchKeyword,String status);


    void updateUser(Integer id, EmployeeUpdateRequestDtTO employeeUpdateRequestDtTO);
    ResponseEntity<Object>getExperience(Integer id);

    void changePassword(Integer id, ChangePasswordRequestDTO changePasswordRequestDTO);
    void updateLastEligibleDate(Integer id, UpdateEligibilityDateRequestDTO updateEligibilityDateRequestDTO);
    void uploadImage(Integer id, MultipartFile file);
    User getImage(Integer id);
}
