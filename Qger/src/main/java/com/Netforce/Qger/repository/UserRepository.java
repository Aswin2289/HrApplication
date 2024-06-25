package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.domain.Specification;
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByName(String name);

    Optional<User> findByEmployeeIdAndStatus(String email, byte b);
    Optional<User> findByIdAndStatusIn(Integer Id,byte[] status);
    Optional<User> findByEmployeeIdAndStatusIn(String Id,byte[] status);
    Optional<User> findByEmployeeIdAndStatusInAndRoleIdIn(String employeeId,byte[] status,Integer[] role);
    int countByStatusIn(byte[] status);
    int countByQidExpireAfterAndQidExpireBeforeAndStatusIn(LocalDate startDate, LocalDate endDate,byte[] status);
    int countByPassportExpireAfterAndPassportExpireBeforeAndStatusIn(LocalDate startDate, LocalDate endDate,byte[] status);
    int countByLicenseExpireAfterAndLicenseExpireBeforeAndStatusIn(LocalDate startDate, LocalDate endDate,byte[] status);
    Page<User> findAllByStatusIn(byte[] status, Pageable pageable);
    Page<User> findAll(Specification<User> spec, Pageable pageable);

    List<User> findAllByYearStatusIn(byte[] yearStatus);
    List<User> findAllByStatusIn(byte[] status);
}
