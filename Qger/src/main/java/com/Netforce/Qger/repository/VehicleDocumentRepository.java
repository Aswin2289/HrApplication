package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.VehicleDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleDocumentRepository extends JpaRepository<VehicleDocument,Integer> {

        List<VehicleDocument>findByVehicleIdAndStatus(Integer id ,byte status);

        VehicleDocument findByIdAndStatus(Integer id ,byte status);
}
