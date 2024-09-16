package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.VehicleResponseDTO;
import com.Netforce.Qger.repository.UserCriteriaRepository;
import com.Netforce.Qger.service.DownloadService;
import com.Netforce.Qger.service.LeaveService;
import com.Netforce.Qger.service.UserService;
import com.Netforce.Qger.service.VehicleService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class DownloadServiceImpl implements DownloadService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private final UserService userService;
    private final CommonUtils commonUtils;
    private final UserCriteriaRepository userCriteriaRepository;
    private final LeaveService leaveService;
    private final VehicleService vehicleService;

    @Override
    public void employeeDownload(String searchKeyword, String status, boolean qidExpiresThisMonth, boolean passportExpired, boolean licenseExpired, String sortBy, String sortOrder, Pageable pageable, PrintWriter writer) {
        Page<User> userPage = userCriteriaRepository.getUsersWithFilters(searchKeyword, status, qidExpiresThisMonth, passportExpired, licenseExpired, sortBy, sortOrder, pageable);

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("Employee ID", "Name", "Job Title", "Department", "QID", "QID Expire", "Nationality", "Qualification", "Contract Period", "Joining Date", "Prev Experience", "Experience", "Passport", "Passport Expire", "License", "License Expire", "Status", "Year Status", "Gender"))) {

            for (User employee : userPage) {
                csvPrinter.printRecord(employee.getEmployeeId(), employee.getName(), employee.getJobTitle(), getDepartmentName(employee.getDepartment()), employee.getQid(), formatDate(employee.getQidExpire()), employee.getNationality(), employee.getQualification(), employee.getContractPeriod(), formatDate(employee.getJoiningDate()), employee.getPrevExperience(), employee.getExperience(), employee.getPassport(), formatDate(employee.getPassportExpire()), employee.getLicense(), formatDate(employee.getLicenseExpire()), getStatusName(employee.getStatus()), getYearStatusName(employee.getYearStatus()), getGenderName(employee.getGender()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private String getDepartmentName(byte department) {
        for (User.Department dept : User.Department.values()) {
            if (dept.value == department) {
                return dept.name();
            }
        }
        return "Unknown";
    }

    private String getStatusName(byte status) {
        for (User.Status stat : User.Status.values()) {
            if (stat.value == status) {
                return stat.name();
            }
        }
        return "Unknown";
    }

    private String getYearStatusName(byte yearStatus) {
        for (User.YearStatus yrStat : User.YearStatus.values()) {
            if (yrStat.value == yearStatus) {
                return yrStat.name();
            }
        }
        return "Unknown";
    }

    private String getGenderName(byte gender) {
        for (User.Gender gen : User.Gender.values()) {
            if (gen.value == gender) {
                return gen.name();
            }
        }
        return "Unknown";
    }

    private String formatDate(Object date) {
        if (date instanceof LocalDate) {
            return ((LocalDate) date).format(DATE_FORMATTER);
        } else if (date instanceof Date) {
            return commonUtils.convertToLocalDate((Date) date).format(DATE_FORMATTER);
        } else {
            return "N/A";
        }
    }


    public void downloadAllAdminAcceptedLeave(Integer page, Integer size, String sortBy, String sortOrder, byte[] status, byte[] department, PrintWriter writer) {
        // Fetch leave data
        PagedResponseDTO<LeavePendingResponseDTO> leaveData = leaveService.getAllForHrLeavePendingResponse(page, size, sortBy, sortOrder, status, department);

        if (leaveData == null) {
            System.err.println("leaveService returned null");
            return;
        }

        if (leaveData.getItems() == null) {
            System.err.println("leaveData.getItems() returned null");
            return;
        }

        if (leaveData.getItems().isEmpty()) {
            System.err.println("No leave data found in the list");
            return;
        }


        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader("Name", "Leave Type", "Leave From", "Leave To", "Reason", "Leave Balance", "Status"))) {

            for (LeavePendingResponseDTO leavePendingResponseDTO : leaveData.getItems()) {
                if (leavePendingResponseDTO == null) {
                    System.err.println("Encountered null LeavePendingResponseDTO");
                    continue;
                }

                // Logging each field to see if there are null values

                csvPrinter.printRecord(leavePendingResponseDTO.getName(), leavePendingResponseDTO.getLeaveType(), leavePendingResponseDTO.getFrom(), leavePendingResponseDTO.getTo(), leavePendingResponseDTO.getReason(), leavePendingResponseDTO.getAvailableLeaveBalance(), leavePendingResponseDTO.getStatus());
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void downloadVehicle(String searchKeyword, String status, String sortBy, String sortOrder, Boolean istimaraExpireDate, Boolean insuranceExpire, Pageable pageable, PrintWriter writer) {

        PagedResponseDTO<VehicleResponseDTO> viewAllVehicle = vehicleService.viewAllVehicle(searchKeyword, status, sortBy, sortOrder, istimaraExpireDate, insuranceExpire, pageable);

        if (viewAllVehicle == null) {
            System.err.println("vehicleService returned null");
            return;
        }

        if (viewAllVehicle.getItems() == null) {
            System.err.println("viewAllVehicle.getItems() returned null");
            return;
        }

        if (viewAllVehicle.getItems().isEmpty()) {
            System.err.println("No vehicle data found in the list");
            return;
        }

        try (CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(
                "Vehicle ID", "Vehicle Number", "Manufacture Date", "Vehicle Type",
                "Model", "Brand", "Insurance Provider", "Insurance Expire",
                "Istimara Date", "Total Kilometer", "Assigned",
                "Istimara Number", "Status"))) {

            for (VehicleResponseDTO vehicleResponseDTO : viewAllVehicle.getItems()) {
                if (vehicleResponseDTO == null) {
                    System.err.println("Encountered null VehicleResponseDTO");
                    continue;
                }

                csvPrinter.printRecord(
                        vehicleResponseDTO.getVehicleNumber(),              // Vehicle ID
                        vehicleResponseDTO.getVehicleNumber(),          // Vehicle Number
                        vehicleResponseDTO.getManufactureDate(),        // Manufacture Date
                        getVehicleTypeName(vehicleResponseDTO.getVehicleType()),  // Vehicle Type (converting byte to name)
                        vehicleResponseDTO.getModal(),           // Model
                        vehicleResponseDTO.getBrand(),                  // Brand
                        vehicleResponseDTO.getInsuranceProvider(),      // Insurance Provider
                        vehicleResponseDTO.getInsuranceExpire(),        // Insurance Expire
                        vehicleResponseDTO.getIstimaraDate(),           // Istimara Date
                        vehicleResponseDTO.getTotalKilometer(),         // Total Kilometer
                                        // Remarks
                        getAssignedStatusName(vehicleResponseDTO.getAssigned()),  // Assigned (converting byte to name)
                        vehicleResponseDTO.getIstimaraNumber(),         // Istimara Number
                        getStatusNameVehicle(vehicleResponseDTO.getStatus())   // Status (converting byte to name)
                );
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private String getVehicleTypeName(byte vehicleType) {
        switch (vehicleType) {
            case 0: return "Private";
            case 1: return "Commercial";
            case 2: return "Trailer";
            case 3: return "Equipment";
            case 4: return "Heavy Equipment";
            default: return "Unknown";
        }
    }

    private String getAssignedStatusName(byte assigned) {
        switch (assigned) {
            case 0: return "Assigned";
            case 1: return "Not Assigned";
            case 2: return "Can't be Assigned";
            default: return "Unknown";
        }
    }

    private String getStatusNameVehicle(byte status) {
        switch (status) {
            case 0: return "Inactive";
            case 1: return "Active";
            case 2: return "Deleted";
            default: return "Unknown";
        }
    }





}
