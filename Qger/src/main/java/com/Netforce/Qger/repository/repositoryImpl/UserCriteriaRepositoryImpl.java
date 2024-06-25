package com.Netforce.Qger.repository.repositoryImpl;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.repository.UserCriteriaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

@Repository
public class UserCriteriaRepositoryImpl implements UserCriteriaRepository {

  private static final String SEPARATOR = ",";
  @PersistenceContext private final EntityManager entityManager;
  public UserCriteriaRepositoryImpl(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  @Override
  public Page<User> getUsersWithFilters(
          String searchKeyword,
          String status,
          boolean qidExpiresThisMonth,
          boolean passportExpired,
          boolean licenseExpired,
          String sortBy,
          String sortOrder,
          Pageable pageable) {
    CriteriaBuilder cb = entityManager.getCriteriaBuilder();
    CriteriaQuery<User> query = cb.createQuery(User.class);
    Root<User> root = query.from(User.class);
    List<Predicate> predicates = new ArrayList<>();

    // Constructing predicates based on filters
    if (searchKeyword != null && !searchKeyword.isEmpty()) {
      predicates.add(
              cb.or(
                      cb.like(cb.lower(root.get("name")), "%" + searchKeyword.toLowerCase() + "%"),
                      cb.like(cb.lower(root.get("employeeId")), "%" + searchKeyword.toLowerCase() + "%")));
    }

    if (!StringUtils.isEmpty(status)) {
      String[] statusArray = status.split(SEPARATOR);
      List<Byte> statusBytes = new ArrayList<>();
      for (String statusValue : statusArray) {
        statusBytes.add(Byte.parseByte(statusValue));
      }
      predicates.add(root.get("status").in(statusBytes));
    }

    if (qidExpiresThisMonth) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(3);
      Predicate predicateStartDate = cb.lessThanOrEqualTo(root.get("qidExpire"), threeMonthsFromNow);
      Predicate predicateEndDate = cb.greaterThanOrEqualTo(root.get("qidExpire"), today);
      Predicate finalPredicate = cb.and(predicateStartDate, predicateEndDate);
      predicates.add(finalPredicate);
    }
    if (passportExpired) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(6);
      Predicate predicateStartDate = cb.lessThanOrEqualTo(root.get("passportExpire"), threeMonthsFromNow);
      Predicate predicateEndDate = cb.greaterThanOrEqualTo(root.get("passportExpire"), today);
      Predicate finalPredicate = cb.and(predicateStartDate, predicateEndDate);
      predicates.add(finalPredicate);
    }
    if (licenseExpired) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(2);
      Predicate predicateStartDate = cb.lessThanOrEqualTo(root.get("licenseExpire"), threeMonthsFromNow);
      Predicate predicateEndDate = cb.greaterThanOrEqualTo(root.get("licenseExpire"), today);
      Predicate finalPredicate = cb.and(predicateStartDate, predicateEndDate);
      predicates.add(finalPredicate);
    }


    query.where(predicates.toArray(new Predicate[0]));

    // Sorting
    if (sortBy != null && !sortBy.isEmpty()) {
        switch (sortBy) {
          case "employeeId" -> {
            if ("asc".equalsIgnoreCase(sortOrder)) {
              query.orderBy(cb.asc(root.get("employeeId")));
            } else if ("desc".equalsIgnoreCase(sortOrder)) {
              query.orderBy(cb.desc(root.get("employeeId")));
            }
          }
            case "name" -> {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(root.get("name")));
                } else if ("desc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.desc(root.get("name")));
                }
            }
            case "joiningDate" -> {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(root.get("joiningDate")));
                } else if ("desc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.desc(root.get("joiningDate")));
                }
            }
            case "qidExpire" -> {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(root.get("qidExpire")));
                } else if ("desc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.desc(root.get("qidExpire")));
                }
            }
            case "passportExpire" -> {
                if ("asc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.asc(root.get("passportExpire")));
                } else if ("desc".equalsIgnoreCase(sortOrder)) {
                    query.orderBy(cb.desc(root.get("passportExpire")));
                }
            }
        }
    }

    // Execute query with pagination
    List<User> resultList =
            entityManager
                    .createQuery(query)
                    .setFirstResult((int) pageable.getOffset())
                    .setMaxResults(pageable.getPageSize())
                    .getResultList();

    // Get total count of records
    CriteriaBuilder countCb = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> countQuery = countCb.createQuery(Long.class);
    Root<User> countRoot = countQuery.from(User.class);
    countQuery.select(countCb.count(countRoot));

    // Apply filters for total count query
    List<Predicate> countPredicates = new ArrayList<>();

    if (!StringUtils.isEmpty(status)) {
      String[] statusArray = status.split(SEPARATOR);
      List<Byte> statusBytes = new ArrayList<>();
      for (String statusValue : statusArray) {
        statusBytes.add(Byte.parseByte(statusValue));
      }
      countPredicates.add(countRoot.get("status").in(statusBytes));
    }
    if (qidExpiresThisMonth) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(3);
      Predicate predicateEndDate = countCb.lessThanOrEqualTo(countRoot.get("qidExpire"), threeMonthsFromNow);

      Predicate predicateStartDate = countCb.greaterThanOrEqualTo(countRoot.get("qidExpire"), today);
      Predicate finalPredicate = countCb.and(predicateStartDate, predicateEndDate);
      countPredicates.add(finalPredicate);
    }
    if (passportExpired) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(6);
      Predicate predicateEndDate = countCb.lessThanOrEqualTo(countRoot.get("passportExpire"), threeMonthsFromNow);

      Predicate predicateStartDate = countCb.greaterThanOrEqualTo(countRoot.get("passportExpire"), today);
      Predicate finalPredicate = countCb.and(predicateStartDate, predicateEndDate);
      countPredicates.add(finalPredicate);
    }
    if (licenseExpired) {
      LocalDate today = LocalDate.now();
      LocalDate threeMonthsFromNow = today.plusMonths(2);
      Predicate predicateEndDate = countCb.lessThanOrEqualTo(countRoot.get("licenseExpire"), threeMonthsFromNow);

      Predicate predicateStartDate = countCb.greaterThanOrEqualTo(countRoot.get("licenseExpire"), today);
      Predicate finalPredicate = countCb.and(predicateStartDate, predicateEndDate);
      countPredicates.add(finalPredicate);
    }
    if (!countPredicates.isEmpty()) {
      countQuery.where(countPredicates.toArray(new Predicate[0]));
    }

    TypedQuery<Long> typedCountQuery = entityManager.createQuery(countQuery);
    long totalCount = typedCountQuery.getSingleResult();
    return new PageImpl<>(resultList, pageable, totalCount);
  }
}
