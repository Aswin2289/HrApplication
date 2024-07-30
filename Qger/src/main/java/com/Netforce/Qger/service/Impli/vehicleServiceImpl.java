package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.entity.dto.requestDto.VehicleRequestDto;
import com.Netforce.Qger.entity.dto.responseDto.PagedResponseDTO;
import com.Netforce.Qger.entity.dto.responseDto.VehicleResponseDTO;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.UserRepository;
import com.Netforce.Qger.repository.VehicleCriteriaRepository;
import com.Netforce.Qger.repository.VehicleRepository;
import com.Netforce.Qger.service.VehicleService;
import com.Netforce.Qger.util.CommonUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.relational.core.sql.In;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class vehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    private final VehicleCriteriaRepository vehicleCriteriaRepository;

    private final MessageSource messageSource;
    private final UserRepository userRepository;
    private final CommonUtils commonUtils;


    @Override
    public void addVehicle(VehicleRequestDto vehicleRequestDto){

        commonUtils.validateHR();

        if (vehicleRequestDto.getManufactureDate().isAfter(LocalDate.now())) {
            throw new BadRequestException(
                    messageSource.getMessage("MANUFACTURE_DATE_INVALID", null, Locale.ENGLISH));
        }
        if (vehicleRequestDto.getInsuranceExpire().isBefore(LocalDate.now())) {
            throw new BadRequestException(
                    messageSource.getMessage("INSURANCE_EXPIRE_DATE_INVALID", null, Locale.ENGLISH));
        }
        if (vehicleRequestDto.getIstimaraDate().isBefore(LocalDate.now())) {
            throw new BadRequestException(
                    messageSource.getMessage("ISTIMARA_DATE_INVALID", null, Locale.ENGLISH));
        }

        Vehicle vehicle=vehicleRepository.findByVehicleNumberIgnoreCase(vehicleRequestDto.getVehicleNumber());
        if(vehicle==null){
            vehicleRepository.save(new Vehicle(vehicleRequestDto));
        }
        else{
            throw new BadRequestException(messageSource.getMessage("VEHICLE_EXIST",null,Locale.ENGLISH));
        }

    }

    @Override
    public PagedResponseDTO<VehicleResponseDTO> viewAllVehicle(String searchKeyword,String status, String sortBy, String sortOrder, Boolean istimaraExpireDate, Boolean insuranceExpire, Pageable pageable){
        Page<Vehicle> vehiclePage =
                vehicleCriteriaRepository.getAllVehicle(
                        searchKeyword,
                        status,
                        sortBy,
                        sortOrder,
                        istimaraExpireDate,
                        insuranceExpire,
                        pageable);

        List<VehicleResponseDTO>vehicleResponseDTOS= vehiclePage.getContent().stream()
                .map(vehicle -> {
                    LocalDate today = LocalDate.now();
                    Integer noOfDaysInsuranceExpire =
                            Math.toIntExact(
                                    commonUtils.calculateDaysDifference(today, vehicle.getInsuranceExpire()));
                    Integer noOfDaysIstimara =
                            Math.toIntExact(
                                    commonUtils.calculateDaysDifference(today, vehicle.getIstimaraDate()));
                    String userName;
                    if(vehicle.getUser()==null){
                        userName=null;
                    }
                    else{
                        userName=vehicle.getUser().getName();
                    }
                    return new VehicleResponseDTO(
                            vehicle.getId(),
                            vehicle.getVehicleNumber(),
                            vehicle.getVehicleType(),
                            vehicle.getModal(),
                            vehicle.getBrand(),
                            vehicle.getInsuranceProvider(),
                            vehicle.getInsuranceExpire(),
                            vehicle.getIstimaraDate(),
                            vehicle.getTotalKilometer(),
                            vehicle.getAssigned(),
                            vehicle.getStatus(),
                            vehicle.getIstimaraNumber(),
                            vehicle.getRegistrationDate(),
                            vehicle.getManufactureDate(),
                            userName,
                            noOfDaysInsuranceExpire,
                            noOfDaysIstimara
//                            vehicle.getImage()
                    );
                }).collect(Collectors.toList());

        return new PagedResponseDTO<>(
                vehicleResponseDTOS,
                vehiclePage.getTotalPages(),
                vehiclePage.getTotalElements(),
                vehiclePage.getNumber());

    }

    @Override
    public void deleteVehicle(Integer id){
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};
        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(id,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        if(vehicle.getAssigned()==Vehicle.Assigned.ASSIGNED.value){
            throw new BadRequestException(messageSource.getMessage("VEHICLE_ASSIGNED",null,Locale.ENGLISH));
        }
        vehicle.setStatus(Vehicle.Status.DELETED.value);
        vehicleRepository.save(vehicle);
    }

    @Override
    public void assignVehicle(Integer id, Integer userId){
        byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
        Vehicle vehicle=vehicleRepository.findByIdAndStatus(id,Vehicle.Status.ACTIVE.value).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        User user =
                userRepository
                        .findByIdAndStatusIn(userId, userStatus)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

        if(vehicle.getAssigned()==Vehicle.Assigned.CANT_ASSIGNED.value){
            throw new BadRequestException(messageSource.getMessage("VEHICLE_CANT_ASSIGNED",null,Locale.ENGLISH));

        }
        vehicle.setAssigned(Vehicle.Assigned.ASSIGNED.value);
        vehicle.setUser(user);
        vehicleRepository.save(vehicle);


    }
    @Override
    public void removeAssignee(Integer id){
        Vehicle vehicle=vehicleRepository.findByIdAndStatus(id,Vehicle.Status.ACTIVE.value).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        if(vehicle.getAssigned()==Vehicle.Assigned.CANT_ASSIGNED.value){
            throw new BadRequestException(messageSource.getMessage("VEHICLE_CANT_ASSIGNED",null,Locale.ENGLISH));

        }
        vehicle.setAssigned(Vehicle.Assigned.NOT_ASSIGNED.value);
        vehicle.setUser(null);
        vehicleRepository.save(vehicle);
    }

    @Override
    public VehicleResponseDTO getVehicleDetail(Integer id){
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};

        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(id,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));


        VehicleResponseDTO vehicleResponseDTO=new VehicleResponseDTO();
        vehicleResponseDTO.setId(vehicle.getId());
        vehicleResponseDTO.setVehicleNumber(vehicle.getVehicleNumber());
        vehicleResponseDTO.setVehicleType(vehicle.getVehicleType());
        vehicleResponseDTO.setModal(vehicle.getModal());
        vehicleResponseDTO.setBrand(vehicle.getBrand());
        vehicleResponseDTO.setInsuranceProvider(vehicle.getInsuranceProvider());
        vehicleResponseDTO.setInsuranceExpire(vehicle.getInsuranceExpire());
        vehicleResponseDTO.setIstimaraDate(vehicle.getIstimaraDate());
        vehicleResponseDTO.setIstimaraNumber(vehicle.getIstimaraNumber());
        vehicleResponseDTO.setTotalKilometer(vehicle.getTotalKilometer());
        vehicleResponseDTO.setAssigned(vehicle.getAssigned());
        vehicleResponseDTO.setStatus(vehicle.getStatus());
        vehicleResponseDTO.setRegistrationDate(vehicle.getRegistrationDate());
        String userName;
        if(vehicle.getUser()==null){
            userName=null;
        }
        else{
            userName=vehicle.getUser().getName();
        }
        LocalDate today = LocalDate.now();
        Integer noOfDaysInsuranceExpire =
                Math.toIntExact(
                        commonUtils.calculateDaysDifference(today, vehicle.getInsuranceExpire()));
        Integer noOfDaysIstimara =
                Math.toIntExact(
                        commonUtils.calculateDaysDifference(today, vehicle.getIstimaraDate()));

        vehicleResponseDTO.setManufactureDate(vehicle.getManufactureDate());
        vehicleResponseDTO.setUserName(userName);
        vehicleResponseDTO.setNoOfDaysInsuranceExpire(noOfDaysInsuranceExpire);
        vehicleResponseDTO.setNoOfDaysIstimaraExpire(noOfDaysIstimara);
        return vehicleResponseDTO;

    }


    @Override
    public void updateVehicle(Integer id,VehicleRequestDto vehicleRequestDto){
        commonUtils.validateHR();
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};
        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(id,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_EXIST", null, Locale.ENGLISH)));
        if(vehicle.getManufactureDate()!=vehicleRequestDto.getManufactureDate()) {
            if (vehicleRequestDto.getManufactureDate().isAfter(LocalDate.now())) {
                throw new BadRequestException(
                        messageSource.getMessage("MANUFACTURE_DATE_INVALID", null, Locale.ENGLISH));
            }
            vehicle.setManufactureDate(vehicleRequestDto.getManufactureDate());

        }
        if (vehicle.getInsuranceExpire()!=vehicleRequestDto.getInsuranceExpire()) {
            if (vehicleRequestDto.getInsuranceExpire().isBefore(LocalDate.now())) {
                throw new BadRequestException(
                        messageSource.getMessage("INSURANCE_EXPIRE_DATE_INVALID", null, Locale.ENGLISH));
            }
            vehicle.setInsuranceExpire(vehicleRequestDto.getInsuranceExpire());

        }
        if (vehicle.getIstimaraDate()!=vehicleRequestDto.getIstimaraDate()) {
            if (vehicleRequestDto.getIstimaraDate().isBefore(LocalDate.now())) {
                throw new BadRequestException(
                        messageSource.getMessage("ISTIMARA_DATE_INVALID", null, Locale.ENGLISH));
            }
            vehicle.setIstimaraDate(vehicleRequestDto.getIstimaraDate());

        }
        vehicle.setVehicleNumber(vehicleRequestDto.getVehicleNumber());
        vehicle.setVehicleType(vehicleRequestDto.getVehicleType());
        vehicle.setModal(vehicleRequestDto.getModal());
        vehicle.setBrand(vehicleRequestDto.getBrand());
        vehicle.setInsuranceProvider(vehicleRequestDto.getInsuranceProvider());
        vehicle.setTotalKilometer(vehicleRequestDto.getTotalKilometer());
        vehicle.setIstimaraNumber(vehicleRequestDto.getIstimaraNumber());
        vehicle.setRegistrationDate(vehicleRequestDto.getRegistrationDate());
        vehicle.setRemarks(vehicleRequestDto.getRemarks());
        vehicleRepository.save(vehicle);

    }


    @Override
    public void uploadImage(Integer id, MultipartFile file){
        commonUtils.validateHR();
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new BadRequestException(
                    messageSource.getMessage("IMAGE_SIZE", null, Locale.ENGLISH));
        }
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};

        Vehicle vehicle=vehicleRepository.findByIdAndStatusIn(id,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));

        try{
            vehicle.setImage(file.getBytes());
            vehicleRepository.save(vehicle);

        }catch (IOException e){
            throw new BadRequestException(messageSource.getMessage("UNEXPECTED_ERROR",null,Locale.ENGLISH));
        }

    }
    @Override
    public Vehicle getImage(Integer id){
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};

        return vehicleRepository.findByIdAndStatusIn(id,vehicleStatus).orElseThrow(
                () ->
                        new BadRequestException(
                                messageSource.getMessage("VEHICLE_NOT_FOUND", null, Locale.ENGLISH)));
    }


    @Override
    public String getVehicleNumber(Integer userId){
        byte[] userStatus = {User.Status.ACTIVE.value, User.Status.VACATION.value};
        byte[] vehicleStatus={Vehicle.Status.ACTIVE.value,Vehicle.Status.INACTIVE.value};
        User user =
                userRepository
                        .findByIdAndStatusIn(userId, userStatus)
                        .orElseThrow(
                                () ->
                                        new BadRequestException(
                                                messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH)));

        Vehicle vehicle=vehicleRepository.findByUserIdAndStatusIn(Math.toIntExact(user.getId()),vehicleStatus);
        String vehicleNumber;
        if (vehicle==null){
            vehicleNumber=null;
        }
        else{
            vehicleNumber=vehicle.getVehicleNumber();
        }
        return vehicleNumber;

    }
}
