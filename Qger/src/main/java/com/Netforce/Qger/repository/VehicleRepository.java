package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.Vehicle;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle,Integer> {

    Vehicle findByVehicleNumberIgnoreCase(String vehicleNumber);

//    Page<Vehicle> findByStatus
    Optional<Vehicle>findByIdAndStatus(Integer id,byte status);
    Optional<Vehicle>findByIdAndStatusIn(Integer id,byte[] status);

    int countByIstimaraDateAfterAndIstimaraDateBeforeAndStatusIn(LocalDate startDate, LocalDate endDate, byte[] status);
    int countByInsuranceExpireAfterAndInsuranceExpireBeforeAndStatusIn(LocalDate startDate, LocalDate endDate, byte[] status);
    Vehicle findByUserIdAndStatusIn(Integer id,byte[] status);
}
