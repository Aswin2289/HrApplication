package com.Netforce.Qger.controller;


import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.dto.responseDto.LeavePendingResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.VehicleResponseDTO;
import com.Netforce.Qger.service.DownloadService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.PrintWriter;

@RestController
@RequestMapping("/api/v1/download")
@RequiredArgsConstructor
public class DownloadController {

    private final DownloadService downloadService;

    @GetMapping("/employees/csv")
    public void downloadCSV(
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false, defaultValue = "1,2") String status,
            @RequestParam(required = false, defaultValue = "false") boolean qidExpiresThisMonth,
            @RequestParam(required = false, defaultValue = "false") boolean passportExpired,
            @RequestParam(required = false, defaultValue = "false") boolean licenseExpired,
            @RequestParam(required = false, defaultValue = "joiningDate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletResponse response) throws IOException {
        page = 0;
        size = 1000;
        Pageable pageable = PageRequest.of(page, size);
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=employees.csv");

        try (PrintWriter writer = response.getWriter()) {
            downloadService.employeeDownload(searchKeyword,
                    status,
                    qidExpiresThisMonth,
                    passportExpired,
                    licenseExpired,
                    sortBy,
                    sortOrder,
                    pageable,
                    writer);
        }
    }

    @GetMapping("/admin/acceptedLeave")
    public void downloadAllAdminAcceptedLeave(
            @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletResponse response) throws IOException {
        page = 0;
        size = 1000;
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=employees.csv");

        byte[] status = {Leave.Status.ACCEPTED.value};
        byte[] department ={User.Department.PRODUCTION.value, User.Department.OFFICE.value};
        try (PrintWriter writer = response.getWriter()) {
            downloadService.downloadAllAdminAcceptedLeave(
                    page, size, sortBy, sortOrder, status,department,
                    writer);
        }


    }

    @GetMapping("/admin/pendingLeave")
    public void downloadAllAdminPendingLeave(
            @RequestParam(required = false, defaultValue = "createdDate") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletResponse response)throws IOException {
        byte[] status = {
                Leave.Status.ACCEPTED_BY_HR.value,
                Leave.Status.ACCEPTED_BY_HOD.value,
                Leave.Status.PENDING.value
        };
        byte[] department ={User.Department.PRODUCTION.value, User.Department.OFFICE.value};
        page = 0;
        size = 1000;
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=employees.csv");
        try (PrintWriter writer = response.getWriter()) {
            downloadService.downloadAllAdminAcceptedLeave(
                    page, size, sortBy, sortOrder, status,department,
                    writer);
        }
    }

    @GetMapping("/vehicle/list")
    public void downloadVehicleWithFilters(
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false, defaultValue = "1,0") String status,
            @RequestParam(required = false, defaultValue = "joiningDate") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(required = false, defaultValue = "false") boolean istimaraExpireDate,
            @RequestParam(required = false, defaultValue = "false") boolean insuranceExpire,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletResponse response)throws IOException {

        page = 0;
        size = 1000;
        Pageable pageable = PageRequest.of(page, size);
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=employees.csv");
        try (PrintWriter writer = response.getWriter()) {
            downloadService.downloadVehicle(
                     searchKeyword, status, sortBy, sortOrder, istimaraExpireDate,  insuranceExpire, pageable,
                    writer);
        }
    }


}
