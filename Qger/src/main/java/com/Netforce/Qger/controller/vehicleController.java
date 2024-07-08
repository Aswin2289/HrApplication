package com.Netforce.Qger.controller;

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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/vehicle")
@RequiredArgsConstructor
public class vehicleController {

    private final VehicleService vehicleService;

    @PostMapping("/add")
    public ResponseEntity<Object> addUser(@Valid @RequestBody VehicleRequestDto vehicleRequestDto){
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


}
