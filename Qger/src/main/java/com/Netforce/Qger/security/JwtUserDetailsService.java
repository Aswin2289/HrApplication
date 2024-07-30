package com.Netforce.Qger.security;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class JwtUserDetailsService implements UserDetailsService {

  @Autowired UserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String employeeId) throws UsernameNotFoundException {
    Optional<User> optUser =
        userRepository.findByEmployeeIdAndStatus(employeeId, User.Status.ACTIVE.value);
    if (optUser.isPresent()) {
      return new org.springframework.security.core.userdetails.User(
          optUser.get().getEmployeeId(),
          "",
          List.of(new SimpleGrantedAuthority(optUser.get().getRole().getName())));
    } else {
      throw new UsernameNotFoundException("Can't find user with EmployeeId :- " + employeeId);
    }
  }
}
