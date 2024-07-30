package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
public interface UserCriteriaRepository {

    Page<User> getUsersWithFilters(String searchKeyword, String status, boolean qidExpiresThisMonth,boolean passportExpired,boolean licenseExpired, String sortBy,String sortOrder, Pageable pageable);
}
