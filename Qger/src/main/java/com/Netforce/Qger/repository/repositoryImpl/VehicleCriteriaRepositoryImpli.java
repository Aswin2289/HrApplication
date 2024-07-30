package com.Netforce.Qger.repository.repositoryImpl;

import com.Netforce.Qger.entity.User;
import com.Netforce.Qger.entity.Vehicle;
import com.Netforce.Qger.repository.VehicleCriteriaRepository;
import com.Netforce.Qger.repository.VehicleRepository;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class VehicleCriteriaRepositoryImpli implements VehicleCriteriaRepository {

    @PersistenceContext
    private final EntityManager entityManager;

    private static final String SEPARATOR = ",";


    public VehicleCriteriaRepositoryImpli(EntityManager entityManager){
        this.entityManager=entityManager;
    }

    @Override
    public Page<Vehicle>getAllVehicle(String searchKeyword,String status, String sortBy,String sortOrder,Boolean istimaraExpireDate,Boolean insuranceExpire, Pageable pageable){
        CriteriaBuilder cb=entityManager.getCriteriaBuilder();
        CriteriaQuery<Vehicle>query=cb.createQuery(Vehicle.class);
        Root<Vehicle>root= query.from(Vehicle.class);
        List<Predicate>predicates=new ArrayList<>();
        if (searchKeyword != null && !searchKeyword.isEmpty()) {
            predicates.add(
                    cb.or(
                            cb.like(cb.lower(root.get("vehicleNumber")), "%" + searchKeyword.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("modal")), "%" + searchKeyword.toLowerCase() + "%"),
                            cb.like(cb.lower(root.get("brand")), "%" + searchKeyword.toLowerCase() + "%")));
        }
        if (!StringUtils.isEmpty(status)) {
            String[] statusArray = status.split(SEPARATOR);
            List<Byte> statusBytes = new ArrayList<>();
            for (String statusValue : statusArray) {
                statusBytes.add(Byte.parseByte(statusValue));
            }
            predicates.add(root.get("status").in(statusBytes));
        }
        if (istimaraExpireDate) {
            LocalDate today = LocalDate.now();
            LocalDate threeMonthsFromNow = today.plusMonths(3);
            Predicate predicateStartDate = cb.lessThanOrEqualTo(root.get("istimaraDate"), threeMonthsFromNow);
            Predicate predicateEndDate = cb.greaterThanOrEqualTo(root.get("istimaraDate"), today);
            Predicate finalPredicate = cb.and(predicateStartDate, predicateEndDate);
            predicates.add(finalPredicate);
        }
        if (insuranceExpire) {
            LocalDate today = LocalDate.now();
            LocalDate threeMonthsFromNow = today.plusMonths(3);
            Predicate predicateStartDate = cb.lessThanOrEqualTo(root.get("insuranceExpire"), threeMonthsFromNow);
            Predicate predicateEndDate = cb.greaterThanOrEqualTo(root.get("insuranceExpire"), today);
            Predicate finalPredicate = cb.and(predicateStartDate, predicateEndDate);
            predicates.add(finalPredicate);
        }

        query.where(predicates.toArray(new Predicate[0]));
        if (sortBy != null && !sortBy.isEmpty()) {
            switch (sortBy) {
                case "vehicleNumber" -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.asc(root.get("vehicleNumber")));
                    } else if ("desc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.desc(root.get("vehicleNumber")));
                    }
                }
                case "insuranceExpire" -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.asc(root.get("insuranceExpire")));
                    } else if ("desc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.desc(root.get("insuranceExpire")));
                    }
                }
                case "istimaraDate" -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.asc(root.get("istimaraDate")));
                    } else if ("desc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.desc(root.get("istimaraDate")));
                    }
                }
                case "brand" -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.asc(root.get("brand")));
                    } else if ("desc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.desc(root.get("brand")));
                    }
                }
                case "createdDate" -> {
                    if ("asc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.asc(root.get("createdDate")));
                    } else if ("desc".equalsIgnoreCase(sortOrder)) {
                        query.orderBy(cb.desc(root.get("createdDate")));
                    }
                }
            }
        }

        List<Vehicle>resultList=entityManager
                .createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Get total count of records
        CriteriaBuilder countCb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Long> countQuery = countCb.createQuery(Long.class);
        Root<Vehicle> countRoot = countQuery.from(Vehicle.class);
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
        if (istimaraExpireDate) {
            LocalDate today = LocalDate.now();
            LocalDate threeMonthsFromNow = today.plusMonths(3);
            Predicate predicateEndDate = countCb.lessThanOrEqualTo(countRoot.get("istimaraDate"), threeMonthsFromNow);

            Predicate predicateStartDate = countCb.greaterThanOrEqualTo(countRoot.get("istimaraDate"), today);
            Predicate finalPredicate = countCb.and(predicateStartDate, predicateEndDate);
            countPredicates.add(finalPredicate);
        }
        if (insuranceExpire) {
            LocalDate today = LocalDate.now();
            LocalDate threeMonthsFromNow = today.plusMonths(6);
            Predicate predicateEndDate = countCb.lessThanOrEqualTo(countRoot.get("insuranceExpire"), threeMonthsFromNow);

            Predicate predicateStartDate = countCb.greaterThanOrEqualTo(countRoot.get("insuranceExpire"), today);
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
