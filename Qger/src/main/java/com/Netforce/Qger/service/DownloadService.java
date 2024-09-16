package com.Netforce.Qger.service;

import org.springframework.data.domain.Pageable;

import java.io.PrintWriter;

public interface DownloadService {


    void employeeDownload(String searchKeyword, String status, boolean qidExpiresThisMonth, boolean passportExpired, boolean licenseExpired, String sortBy, String sortOrder, Pageable pageable, PrintWriter writer);
    void downloadAllAdminAcceptedLeave(Integer page, Integer size, String sort, String order,byte[] status,byte[] department, PrintWriter writer);
    void downloadVehicle(String searchKeyword,String status, String sortBy, String sortOrder, Boolean istimaraExpireDate, Boolean insuranceExpire, Pageable pageable,PrintWriter writer);
}
