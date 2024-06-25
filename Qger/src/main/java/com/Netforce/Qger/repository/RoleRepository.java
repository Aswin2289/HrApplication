package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository  extends JpaRepository<Role, Long> {

    Optional<Role> findById(Integer id);
}
