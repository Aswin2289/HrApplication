package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.LeaveType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LeaveTypeRepository extends JpaRepository<LeaveType,Integer> {

    List<LeaveType> findAllByStatus(byte status);
    List<LeaveType> findAllByStatusOrderByOrderCount(byte status);

    Optional<LeaveType> findByIdAndStatus(Integer integer, byte status);
}
