package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.entity.VehicleDocument;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.VehicleDocumentRepository;
import com.Netforce.Qger.repository.VehicleRepository;
import com.Netforce.Qger.service.VehicleDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class VehicleDocumentServiceImpl implements VehicleDocumentService {

    private final VehicleDocumentRepository vehicleDocumentRepository;

    private final MessageSource messageSource;
    private final VehicleRepository vehicleRepository;


    @Override
    public VehicleDocument saveDocument(MultipartFile file, String documentName, Integer vehicleId){
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(
                    messageSource.getMessage("PDF_NOT_FOUND", null, Locale.ENGLISH));
        }
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};
        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(vehicleId,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        try{
            VehicleDocument vehicleDocument=new VehicleDocument();
            vehicleDocument.setName(file.getOriginalFilename());
            vehicleDocument.setData(file.getBytes());
            vehicleDocument.setDocumentName(documentName);
            vehicleDocument.setStatus(VehicleDocument.Status.ACTIVE.value);
            vehicleDocument.setVehicle(vehicle);
            return vehicleDocumentRepository.save(vehicleDocument);
        }catch (IOException e){
            throw new RuntimeException("Error while processing file", e);
        }


    }

    @Override
    public List<VehicleDocument>getDocumentByVehicle(Integer vehicleId){
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};

        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(vehicleId,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        return vehicleDocumentRepository.findByVehicleIdAndStatus(Math.toIntExact(vehicle.getId()),VehicleDocument.Status.ACTIVE.value);

    }

    @Override
    public VehicleDocument getVehicleDocumentView(long id){
        return vehicleDocumentRepository.findByIdAndStatus((int) id,VehicleDocument.Status.ACTIVE.value);
    }

    @Override
    public VehicleDocument updateVehicleDocument(MultipartFile file, String documentName,Integer documentId){

        VehicleDocument existVehicleDocument=vehicleDocumentRepository.findByIdAndStatus(documentId,VehicleDocument.Status.ACTIVE.value);
        if(existVehicleDocument==null){
            throw new BadRequestException(messageSource.getMessage("VEHICLE_DOCUMENT_NOT_FOUND",null,Locale.ENGLISH));
        }
        try{
            if(file != null && !file.isEmpty()){
                existVehicleDocument.setName(file.getName());
                existVehicleDocument.setData(file.getBytes());
            }
            existVehicleDocument.setDocumentName(documentName);
            return vehicleDocumentRepository.save(existVehicleDocument);
        }catch (IOException e){
            throw new BadRequestException(messageSource.getMessage("FILE_UPLOAD_ERROR",null,Locale.ENGLISH));
        }

    }


    @Override
    public void deleteVehicleDocument(Integer id){
        VehicleDocument vehicleDocument=vehicleDocumentRepository.findByIdAndStatus(id,VehicleDocument.Status.ACTIVE.value);
        if(vehicleDocument==null){
            throw new BadRequestException(messageSource.getMessage("VEHICLE_DOCUMENT_NOT_FOUND",null,Locale.ENGLISH));
        }

        vehicleDocument.setStatus(VehicleDocument.Status.DELETED.value);
        vehicleDocumentRepository.save(vehicleDocument);
    }


}
