package com.Netforce.Qger.controller;

import com.Netforce.Qger.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class DashboardController {

    private final UserService userService;

    @GetMapping("/totalEmployees")
    public ResponseEntity<Object>countEmployees(){
        return new ResponseEntity<>(userService.countUsers(), HttpStatus.OK);
//        return ResponseEntity.ok(userService.countUsers());
    }
    @GetMapping("/getExperience/{id}")
    public ResponseEntity<Object>getExperience(@PathVariable("id") Integer id){
        return new ResponseEntity<>(userService.getExperience(id),HttpStatus.OK);
    }
}
