package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.Leave;
import com.Netforce.Qger.entity.User;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeaveRepository extends JpaRepository<Leave, Integer> {
  List<Leave> findByUserAndTransactionTypeAndStatusIn(
      User user, byte transactionType, byte[] status);

  List<Leave> findByUserAndTransactionTypeAndStatusInAndLeaveTypeId(
      User user, byte transactionType, byte[] status, Integer typeId);

  Page<Leave> findByUserAndStatusInAndTransactionType(
      User user, byte[] status, byte transactionType, Pageable pageable);

  Page<Leave> findAllByStatusInAndTransactionTypeAndUserDepartmentIn(
      byte[] status, byte transactionType,byte[]department, Pageable pageable);
List<Leave> findByUserAndStatusInAndTransactionTypeAndLeaveTypeIdIn(User user,byte[] status,byte transactionType,List<Long> leaveTypeIds);
  Optional<Leave> findByIdAndStatusAndTransactionType(Integer id, byte status, byte transaction);
  Optional<Leave> findByIdAndStatusInAndTransactionType(Integer id, byte[] status, byte transaction);

  List<Leave> findByUserAndLeaveTypeIdInAndLeaveFromAfterAndStatusIn(
      User user, List<Long> typeIds, LocalDate fromDate, List<Byte> status);

  @Query("SELECT l FROM Leave l WHERE l.user = :user AND l.leaveType.id IN :leaveTypeIds AND l.transactionType = :TransactionType AND l.status = :status")
  List<Leave> findLeavesByCriteria(@Param("user") User user,
                                   @Param("leaveTypeIds") List<Long> leaveTypeIds,
                                   @Param("TransactionType") byte transactionType,
                                   @Param("status") byte status);
  List<Leave> findByUserAndLeaveFromLessThanEqualAndLeaveToGreaterThanEqualAndStatus(
          User user, LocalDate fromDate, LocalDate toDate, byte status);
}
