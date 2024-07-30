package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.VehicleDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VehicleDocumentService {


    VehicleDocument saveDocument(MultipartFile file, String documentName,Integer vehicleId);

    List<VehicleDocument>getDocumentByVehicle(Integer vehicleId);

    VehicleDocument getVehicleDocumentView(long id);

    VehicleDocument updateVehicleDocument(MultipartFile file, String documentName,Integer vehicleId);

    void deleteVehicleDocument(Integer id);
}
