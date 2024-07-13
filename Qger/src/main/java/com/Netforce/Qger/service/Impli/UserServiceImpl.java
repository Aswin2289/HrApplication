package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Role;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.entity.dto.requestDto.EmployeeRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.EmployeeUpdateRequestDtTO;
import com.Netforce.Qger.entity.dto.requestDto.LoginRequestDTO;
import com.Netforce.Qger.entity.dto.responseDto.*;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.RoleRepository;
import com.Netforce.Qger.repository.UserCriteriaRepository;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.repository.VehicleRepository;
import com.Netforce.Qger.security.JwtUserDetailsService;
import com.Netforce.Qger.security.TokenManager;
import com.Netforce.Qger.service.UserService;
import com.Netforce.Qger.util.CommonUtils;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
//import javax.persistence.criteria.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final PasswordEncoder passwordEncoder;

  private final RoleRepository roleRepository;

  private final VehicleRepository vehicleRepository;

  private final MessageSource messageSource;

  private final JwtUserDetailsService jwtUserDetailsService;

  private final TokenManager tokenManager;
  private final UserCriteriaRepository userCriteriaRepository;

  private final CommonUtils commonUtils;

  private final byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};

  @Override
  public void addUser(EmployeeRequestDTO employeeRequestDTO) {
    employeeRequestDTO.setPassword(passwordEncoder.encode(employeeRequestDTO.getPassword()));
    if (userRepository
        .findByEmployeeIdAndStatus(employeeRequestDTO.getEmployeeId(), User.Status.ACTIVE.value)
        .isPresent()) {
      throw new BadRequestException(messageSource.getMessage("USER_EXISTS", null, Locale.ENGLISH));
    }

    LocalDate currentDate = LocalDate.now();
    if (employeeRequestDTO.getQidExpire().isBefore(currentDate)
        || employeeRequestDTO.getQidExpire().isEqual(currentDate)) {
      throw new BadRequestException(messageSource.getMessage("QID_EXPIRED", null, Locale.ENGLISH));
    }
    if (employeeRequestDTO.getPassportExpire().isBefore(currentDate)
        || employeeRequestDTO.getPassportExpire().isEqual(currentDate)) {
      throw new BadRequestException(
          messageSource.getMessage("PASSPORT_EXPIRED", null, Locale.ENGLISH));
    }
    if (employeeRequestDTO.getLicenseExpire().isBefore(currentDate)
        || employeeRequestDTO.getLicenseExpire().isEqual(currentDate)) {
      throw new BadRequestException(
          messageSource.getMessage("LICENCE_EXPIRED", null, Locale.ENGLISH));
    }
    //    if (employeeRequestDTO.getContractPeriod().isBefore(currentDate)
    //        || employeeRequestDTO.getContractPeriod().isEqual(currentDate)) {
    //      throw new BadRequestException(
    //          messageSource.getMessage("CONTRACT_EXPIRED", null, Locale.ENGLISH));
    //    }
    Role role =
        roleRepository
            .findById(employeeRequestDTO.getRole())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("ROLE_NOT_FOUND", null, Locale.ENGLISH)));
    System.out.println(employeeRequestDTO);

    userRepository.save(new User(employeeRequestDTO, role));
  }

  @Override
  public ResponseEntity<Object> login(LoginRequestDTO loginRequestDTO) {

    User user =
        userRepository
            .findByEmployeeIdAndStatus(loginRequestDTO.getEmployeeId(), User.Status.ACTIVE.value)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));
    UserDetails userDetails =
        jwtUserDetailsService.loadUserByUsername(loginRequestDTO.getEmployeeId());
    if (!passwordEncoder.matches(loginRequestDTO.getPassword(), user.getPassword())) {
      throw new BadRequestException(
          messageSource.getMessage("PASSWORD_NOT_MATCH", null, Locale.ENGLISH));
    }
    UsernamePasswordAuthenticationToken userPass =
        new UsernamePasswordAuthenticationToken(
            userDetails.getUsername(), null, userDetails.getAuthorities());
    SecurityContextHolder.getContext().setAuthentication(userPass);

    JwtResponseDTO jwtResponseDTO = tokenManager.generateJwtToken(userDetails);
    jwtResponseDTO.setUserName(user.getName());
    jwtResponseDTO.setRole(user.getRole().getId());
    jwtResponseDTO.setId(userDetails.getUsername());
    jwtResponseDTO.setUserId(user.getId());
    return new ResponseEntity<>(jwtResponseDTO, HttpStatus.OK);
  }

  @Override
  @Transactional
  public PagedResponseDTO<UserResponseDTO> getUsersWithFilters(
      String searchKeyword,
      String status,
      boolean qidExpiresThisMonth,
      boolean passportExpired,
      boolean licenseExpired,
      String sortBy,
      String sortOrder,
      Pageable pageable) {
    commonUtils.validateHR();

    Page<User> userPage =
        userCriteriaRepository.getUsersWithFilters(
            searchKeyword,
            status,
            qidExpiresThisMonth,
            passportExpired,
            licenseExpired,
            sortBy,
            sortOrder,
            pageable);

    List<UserResponseDTO> userResponseDTOs =
        userPage.getContent().stream()
            .map(
                user -> {
                  LocalDate today = LocalDate.now();
                  Integer noOfDaysQid =
                      Math.toIntExact(
                          commonUtils.calculateDaysDifference(today, user.getQidExpire()));
                  Integer noOfDaysPassport =
                      Math.toIntExact(
                          commonUtils.calculateDaysDifference(today, user.getPassportExpire()));
                  return new UserResponseDTO(
                      Math.toIntExact(user.getId()),
                      user.getEmployeeId(),
                      user.getName(),
                      user.getJobTitle(),
                      user.getQidExpire(),
                      user.getPassportExpire(),
                      noOfDaysQid,
                      noOfDaysPassport);
                })
            .collect(Collectors.toList());

    return new PagedResponseDTO<>(
        userResponseDTOs,
        userPage.getTotalPages(),
        userPage.getTotalElements(),
        userPage.getNumber());
  }

  @Override
  public void deleteUser(Integer userIds) {
    commonUtils.validateHR();

    User user =
        userRepository
            .findByIdAndStatusIn(userIds, userStatus)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

    user.setStatus(User.Status.INACTIVE.value);
    userRepository.save(user);
  }

  @Override
  public EmployeeDetailsResponseDTO employeeDetails(Integer userId) {
    System.out.println(Arrays.toString(userStatus));
    User user =
        userRepository
            .findByIdAndStatusIn(userId, userStatus)
            .orElseThrow(
                () ->
                    new BadRequestException(
                        messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

    return getEmployeeDetailsResponseDTO(user);
  }

  private EmployeeDetailsResponseDTO getEmployeeDetailsResponseDTO(User user) {
    LocalDate today = LocalDate.now();
    Integer noOfDaysQid =
        Math.toIntExact(commonUtils.calculateDaysDifference(today, user.getQidExpire()));
    Integer noOfDaysPassport =
        Math.toIntExact(commonUtils.calculateDaysDifference(today, user.getPassportExpire()));
    Integer noOfDaysLicense =
        Math.toIntExact(commonUtils.calculateDaysDifference(today, user.getLicenseExpire()));
    System.out.println(user.getJoiningDate());
    EmployeeDetailsResponseDTO employeeDetailsResponseDTO = new EmployeeDetailsResponseDTO();
    employeeDetailsResponseDTO.setId(user.getId());
    employeeDetailsResponseDTO.setEmployeeId(user.getEmployeeId());
    employeeDetailsResponseDTO.setQid(user.getQid());
    employeeDetailsResponseDTO.setQidExpire(user.getQidExpire());
    employeeDetailsResponseDTO.setName(user.getName());
    employeeDetailsResponseDTO.setNationality(user.getNationality());
    employeeDetailsResponseDTO.setGender(user.getGender());
    employeeDetailsResponseDTO.setJobTitle(user.getJobTitle());
    employeeDetailsResponseDTO.setQualification(user.getQualification());
    employeeDetailsResponseDTO.setContractPeriod(user.getContractPeriod());
    employeeDetailsResponseDTO.setExperience(user.getExperience());
    employeeDetailsResponseDTO.setTotalExperience(user.getExperience() + user.getPrevExperience());
    employeeDetailsResponseDTO.setJoiningDate(user.getJoiningDate());
    employeeDetailsResponseDTO.setPassportExpire(user.getPassportExpire());
    employeeDetailsResponseDTO.setPassport(user.getPassport());
    employeeDetailsResponseDTO.setLicenseExpire(user.getLicenseExpire());
    employeeDetailsResponseDTO.setLicense(user.getLicense());
    employeeDetailsResponseDTO.setNoOfDaysQidExpire(noOfDaysQid);
    employeeDetailsResponseDTO.setNoOfDaysPassportExpire(noOfDaysPassport);
    employeeDetailsResponseDTO.setNoOfDaysLicenseExpire(noOfDaysLicense);
    employeeDetailsResponseDTO.setRole(user.getRole().getName());
    employeeDetailsResponseDTO.setStatus(user.getStatus());
    employeeDetailsResponseDTO.setDepartment(user.getDepartment());
    employeeDetailsResponseDTO.setPrevExperience(user.getPrevExperience());
    return employeeDetailsResponseDTO;
  }

  @Override
  public ResponseEntity<Object> countUsers() {

    int total = userRepository.countByStatusIn(userStatus);
    byte[] userStatusActive = {User.Status.ACTIVE.value};
    int activeCount = userRepository.countByStatusIn(userStatusActive);
    int vacationCount = total - activeCount;
    LocalDate today = LocalDate.now();
    LocalDate threeMonthsFromNow = today.plusMonths(3);
    byte[] userStatusQid = {User.Status.ACTIVE.value, User.Status.VACATION.value};
    int qidExpire =
        userRepository.countByQidExpireAfterAndQidExpireBeforeAndStatusIn(
            today, threeMonthsFromNow, userStatusQid);
    LocalDate sixMonthsFromNow = today.plusMonths(6);
    int passportExpire =
        userRepository.countByPassportExpireAfterAndPassportExpireBeforeAndStatusIn(
            today, sixMonthsFromNow, userStatusQid);
    LocalDate twoMonthsFromNow = today.plusMonths(2);

    int licenseExpire =
        userRepository.countByLicenseExpireAfterAndLicenseExpireBeforeAndStatusIn(
            today, twoMonthsFromNow, userStatusQid);
    LocalDate expireDayIn = today.plusDays(45);
    byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};
    int countIstimaraExpire=vehicleRepository.countByIstimaraDateAfterAndIstimaraDateBeforeAndStatusIn(today,expireDayIn,vehicleStatus);

    int countInsuranceExpire=vehicleRepository.countByInsuranceExpireAfterAndInsuranceExpireBeforeAndStatusIn(today,expireDayIn,vehicleStatus);
    Map<String, Integer> counts = new HashMap<>();
    counts.put("total", total);
    counts.put("activeCount", activeCount);
    counts.put("vacationCount", vacationCount);
    counts.put("qidExpire", qidExpire);
    counts.put("passportExpire", passportExpire);
    counts.put("licenseExpire", licenseExpire);
    counts.put("istimaraExpire", countIstimaraExpire);
    counts.put("insuranceExpire", countInsuranceExpire);

    return new ResponseEntity<>(counts, HttpStatus.OK);
  }


//  @Override
//  public PagedResponseDTO<EmployeeHrLeaveDetailDTO> getAllEmployeesLeaveDetails(Integer page, Integer size, String sort, String order) {
//    commonUtils.validateHR();
//    boolean orderD = !order.equalsIgnoreCase("asc");
//    page = Math.max(page, 1);
//    Pageable pageable =
//            PageRequest.of(page - 1, size, (orderD) ? Sort.Direction.DESC : Sort.Direction.ASC, sort);
//    Page<User> usersPage = userRepository.findAllByStatusIn(userStatus,pageable);
//
//    List<EmployeeHrLeaveDetailDTO> employeeHrLeaveDetailDTOS = usersPage.getContent().stream()
//            .map(user -> {
//              int totalCasualLeaveTaken = commonUtils.getTotalLeaveTakenPerYear(user,1);
//              int casualLeaveBalance = commonUtils.getTotalLeaveAddedPerYear(user,1) - totalCasualLeaveTaken;
//              int totalSickLeaveTaken = commonUtils.getTotalLeaveTakenPerYear(user, 2); // Assuming leaveTypeId for sick leave is 2
//              int sickLeaveBalance = commonUtils.getTotalLeaveAddedPerYear(user, 2) - totalSickLeaveTaken; // Assuming leaveTypeId for sick leave is 2
//
//              return new EmployeeHrLeaveDetailDTO(
//                      user.getEmployeeId(),
//                      user.getName(),
//                      totalCasualLeaveTaken,
//                      casualLeaveBalance,
//                      totalSickLeaveTaken,
//                      sickLeaveBalance
//                      // Add more leave types if needed
//              );
//            })
//            .collect(Collectors.toList());
//
//    return new PagedResponseDTO<>(
//            employeeHrLeaveDetailDTOS, usersPage.getTotalPages(), usersPage.getTotalElements(), page);
//  }

  @Override
  public PagedResponseDTO<EmployeeHrLeaveDetailDTO> getAllEmployeesLeaveDetails(Integer page, Integer size, String sort, String order, String searchKeyword, String status) {
    commonUtils.validateHR();
    boolean orderD = !order.equalsIgnoreCase("asc");
    page = Math.max(page, 1);

    // Creating Sort object based on sort and order parameters
    Sort.Direction sortDirection = orderD ? Sort.Direction.DESC : Sort.Direction.ASC;
    Pageable pageable = PageRequest.of(page - 1, size, sortDirection, sort);

    // Creating specifications for dynamic query
    Specification<User> spec = Specification.where(null);

    // Adding search keyword filter
    if (searchKeyword != null && !searchKeyword.isEmpty()) {
      String keywordLike = "%" + searchKeyword.toLowerCase() + "%";
      spec = spec.and((root, query, criteriaBuilder) -> criteriaBuilder.or(
              criteriaBuilder.like(criteriaBuilder.lower(root.get("employeeId")), keywordLike),
              criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), keywordLike)
      ));
    }

    // Adding status filter
    if (!StringUtils.isEmpty(status)) {
      String[] statusArray = status.split(",");
      List<Byte> statusBytes = new ArrayList<>();
      for (String statusValue : statusArray) {
        statusBytes.add(Byte.parseByte(statusValue));
      }
      spec = spec.and((root, query, criteriaBuilder) -> root.get("status").in(statusBytes));
    } else {
      // If no status filter is provided, use the default userStatus
      spec = spec.and((root, query, criteriaBuilder) -> root.get("status").in(userStatus));
    }

    // Fetching data based on specifications
    Page<User> usersPage = userRepository.findAll(spec, pageable);

    List<EmployeeHrLeaveDetailDTO> employeeHrLeaveDetailDTOS = usersPage.getContent().stream()
            .map(user -> {
              int totalCasualLeaveTaken = commonUtils.getTotalLeaveTakenPerYear(user, 1);
              int casualLeaveBalance = commonUtils.getTotalLeaveAddedPerYear(user, 1) - totalCasualLeaveTaken;
              int totalSickLeaveTaken = commonUtils.getTotalLeaveTakenPerYear(user, 2); // Assuming leaveTypeId for sick leave is 2
              int sickLeaveBalance = commonUtils.getTotalLeaveAddedPerYear(user, 2) - totalSickLeaveTaken; // Assuming leaveTypeId for sick leave is 2

              return new EmployeeHrLeaveDetailDTO(
                      user.getEmployeeId(),
                      user.getName(),
                      totalCasualLeaveTaken,
                      casualLeaveBalance,
                      totalSickLeaveTaken,
                      sickLeaveBalance
                      // Add more leave types if needed
              );
            })
            .collect(Collectors.toList());

    return new PagedResponseDTO<>(
            employeeHrLeaveDetailDTOS, usersPage.getTotalPages(), usersPage.getTotalElements(), page);
  }



  @Override
  public void updateUser(Integer id, EmployeeUpdateRequestDtTO employeeUpdateRequestDtTO){
    commonUtils.validateHR();

    User user =
            userRepository
                    .findByIdAndStatusIn(id, userStatus)
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));


    LocalDate currentDate = LocalDate.now();
    if(user.getQidExpire()!=employeeUpdateRequestDtTO.getQidExpire()) {
      if (employeeUpdateRequestDtTO.getQidExpire().isBefore(currentDate)
              || employeeUpdateRequestDtTO.getQidExpire().isEqual(currentDate)) {
        throw new BadRequestException(messageSource.getMessage("QID_EXPIRED", null, Locale.ENGLISH));
      }
    }
    if (user.getPassportExpire()!=employeeUpdateRequestDtTO.getPassportExpire()) {
      if (employeeUpdateRequestDtTO.getPassportExpire().isBefore(currentDate)
              || employeeUpdateRequestDtTO.getPassportExpire().isEqual(currentDate)) {
        throw new BadRequestException(
                messageSource.getMessage("PASSPORT_EXPIRED", null, Locale.ENGLISH));
      }
    }
    if(user.getLicenseExpire()!=employeeUpdateRequestDtTO.getLicenseExpire()) {
      if (employeeUpdateRequestDtTO.getLicenseExpire().isBefore(currentDate)
              || employeeUpdateRequestDtTO.getLicenseExpire().isEqual(currentDate)) {
        throw new BadRequestException(
                messageSource.getMessage("LICENCE_EXPIRED", null, Locale.ENGLISH));
      }
    }

    Role role =
            roleRepository
                    .findById(employeeUpdateRequestDtTO.getRole())
                    .orElseThrow(
                            () ->
                                    new BadRequestException(
                                            messageSource.getMessage("ROLE_NOT_FOUND", null, Locale.ENGLISH)));



    user.setEmployeeId(employeeUpdateRequestDtTO.getEmployeeId());
    user.setName(employeeUpdateRequestDtTO.getName());
    user.setQid(employeeUpdateRequestDtTO.getQid());
    user.setQidExpire(employeeUpdateRequestDtTO.getQidExpire());
    user.setGender(employeeUpdateRequestDtTO.getGender());
    user.setNationality(employeeUpdateRequestDtTO.getNationality());
    user.setQualification(employeeUpdateRequestDtTO.getQualification());
    user.setJobTitle(employeeUpdateRequestDtTO.getJobTitle());
    user.setContractPeriod(employeeUpdateRequestDtTO.getContractPeriod());
    user.setRole(role);
    user.setJoiningDate(employeeUpdateRequestDtTO.getJoiningDate());
    user.setPrevExperience(employeeUpdateRequestDtTO.getPrevExperience());
    user.setExperience(employeeUpdateRequestDtTO.getExperience());
    user.setPassport(employeeUpdateRequestDtTO.getPassport());
    user.setPassportExpire(employeeUpdateRequestDtTO.getPassportExpire());
    user.setLicense(employeeUpdateRequestDtTO.getLicense());
    user.setLicenseExpire(employeeUpdateRequestDtTO.getLicenseExpire());
    user.setDepartment(employeeUpdateRequestDtTO.getDepartment());

    userRepository.save(user);

  }

}
