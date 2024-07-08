package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleCriteriaRepository{

    Page<Vehicle> getAllVehicle(String searchKeyword,String status, String sortBy,String sortOrder, Boolean istimaraExpireDate,Boolean insuranceExpire,Pageable pageable);
}
