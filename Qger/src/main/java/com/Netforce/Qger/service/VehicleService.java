package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.entity.dto.requestDto.VehicleRequestDto;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.VehicleResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.relational.core.sql.In;

import java.util.List;

public interface VehicleService {

    void addVehicle(VehicleRequestDto vehicleRequestDto);

    PagedResponseDTO<VehicleResponseDTO> viewAllVehicle(String searchKeyword,String status, String sortBy, String sortOrder, Boolean istimaraExpireDate, Boolean insuranceExpire, Pageable pageable);

    void deleteVehicle(Integer id);

    void assignVehicle(Integer id, Integer userId);
    void removeAssignee(Integer id);
    VehicleResponseDTO getVehicleDetail(Integer id);

    void updateVehicle(Integer id,VehicleRequestDto vehicleRequestDto);
}
