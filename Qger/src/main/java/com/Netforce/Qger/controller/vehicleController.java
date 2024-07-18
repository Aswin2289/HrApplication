package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.PdfDocument;
import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.entity.dto.requestDto.VehicleRequestDto;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.SuccessResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.UserResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.VehicleResponseDTO;
import com.Netforce.Qger.service.VehicleService;
import com.Netforce.Qger.util.CommonUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vehicle")
@RequiredArgsConstructor
public class vehicleController {

    private final VehicleService vehicleService;

    @PostMapping("/add")
    public ResponseEntity<Object> addUser(@RequestBody VehicleRequestDto vehicleRequestDto){
        System.out.println("---------------------");

        vehicleService.addVehicle(vehicleRequestDto);
        return new ResponseEntity<>(
                new SuccessResponseDTO("201", "Vehicle Added Successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/list")
    public ResponseEntity<PagedResponseDTO<VehicleResponseDTO>> getVehicleWithFilters(
            @RequestParam(required = false) String searchKeyword,
            @RequestParam(required = false, defaultValue = "1,0") String status,
            @RequestParam(required = false, defaultValue = "joiningDate") String sortBy,
            @RequestParam(required = false, defaultValue = "asc") String sortOrder,
            @RequestParam(required = false, defaultValue = "false") boolean istimaraExpireDate,
            @RequestParam(required = false, defaultValue = "false") boolean insuranceExpire,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        PagedResponseDTO<VehicleResponseDTO> response =
                vehicleService.viewAllVehicle(
                        searchKeyword,
                        status,
                        sortBy,
                        sortOrder,
                        istimaraExpireDate,
                        insuranceExpire,
                        pageable);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/delete/{id}")
    public ResponseEntity<Object>deleteVehicle(@PathVariable("id") Integer id){

        vehicleService.deleteVehicle(id);
        return new ResponseEntity<>(
                new SuccessResponseDTO("200", "Vehicle Successfully deleted"), HttpStatus.OK);
    }

    @PutMapping("/assign/{id}")
    public ResponseEntity<Object>assignVehicle(@PathVariable("id")Integer id,@RequestParam(required = true) Integer userId){
        vehicleService.assignVehicle(id,userId);
        return new ResponseEntity<>(new SuccessResponseDTO("200","Vehicle Assigned Successfully"),HttpStatus.OK);
    }
    @PutMapping("/assign/remove/{id}")
    public ResponseEntity<Object>removeAssignVehicle(@PathVariable("id")Integer id){
        vehicleService.removeAssignee(id);
        return new ResponseEntity<>(new SuccessResponseDTO("200","Vehicle Assignee Removed"),HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    public VehicleResponseDTO vehicleDetail(@PathVariable("id")Integer id){
        return vehicleService.getVehicleDetail(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Object>updateVehicle(@PathVariable("id")Integer id,@Valid @RequestBody VehicleRequestDto vehicleRequestDto){
        vehicleService.updateVehicle(id,vehicleRequestDto);
        return new ResponseEntity<>(
                new SuccessResponseDTO("201", "Vehicle Updated Successfully"), HttpStatus.CREATED);
    }

    @PutMapping("upload/{id}")
    public ResponseEntity<Object>uploadImage(@PathVariable("id")Integer id,@RequestParam("file") MultipartFile file){
        vehicleService.uploadImage(id,file);
        return new ResponseEntity<>(
                new SuccessResponseDTO("201", "Vehicle Image Uploaded Successfully"), HttpStatus.CREATED);

    }
//    @GetMapping("/viewImage/{id}")
//    public ResponseEntity<Map<String, Object>> getImage(@PathVariable Long id) {
////        PdfDocument pdfDocument = pdfDocumentService.getPdf(id);
//        Vehicle vehicle=vehicleService.getImage(Math.toIntExact(id));
//        Map<String, Object> response = new HashMap<>();
//        response.put("data", vehicle.getImage());
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
@GetMapping("/viewImage/{id}")
public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
    Vehicle vehicle = vehicleService.getImage(Math.toIntExact(id));
    byte[] imageData = vehicle.getImage();
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.IMAGE_JPEG); // Adjust media type if needed (e.g., MediaType.IMAGE_PNG)
    return new ResponseEntity<>(imageData, headers, HttpStatus.OK);
}

}
