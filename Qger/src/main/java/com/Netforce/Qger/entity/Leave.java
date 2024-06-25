package com.Netforce.Qger.entity;

import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;
import com.Netforce.Qger.entity.dto.requestDto.LeaveUpdateDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@Table(name = "leave_table") // Escaping the table name
public class Leave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties("user_id")
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "leave_type_id", referencedColumnName = "id")
    @JsonIgnoreProperties("leaves")
    private LeaveType leaveType;


    private LocalDate leaveFrom;

    private LocalDate leaveTo;

    private Integer daysAdjusted;

    @NotNull
    private String reason;

    @NotNull
    private byte transactionType;

    private Integer totalEntitled;

    private byte status;

    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updatedDate;

    public enum Status {
        ACCEPTED((byte) 0), PENDING((byte) 1), ACCEPTED_BY_HR((byte) 2), REJECTED((byte) 3), CANCELLED((byte) 4),DELETED((byte) 5),ADDED((byte) 6),APPLICATION_PENDING((byte) 7),APPLICATION_RESCHEDULED((byte) 8),APPLICATION_APPROVED((byte) 9) ,ACCEPTED_BY_HOD((byte) 10);

        public final byte value;

        Status(byte value) {
            this.value = value;
        }
    }
    public enum TransactionType {
        // added-0 taken(relieve)-1 exclude( permanent delete)-2
        ADDED((byte) 0), SUBTRACT((byte) 1),DELETED((byte) 2),APPLICATION((byte) 3);

        public final byte value;

        TransactionType(byte value) {
            this.value = value;
        }
    }

    public Leave(LeaveRequestDTO leaveRequestDTO,User user,LeaveType leaveType) {
        this.leaveType = leaveType;
        this.leaveFrom = leaveRequestDTO.getFrom();
        this.leaveTo = leaveRequestDTO.getTo();
        this.reason = leaveRequestDTO.getReason();
        this.transactionType=leaveRequestDTO.getTransactionType();
        this.daysAdjusted = Math.toIntExact(ChronoUnit.DAYS.between(leaveRequestDTO.getFrom(), leaveRequestDTO.getTo()) + 1);
        this.user = user;
        this.status = leaveRequestDTO.getStatus();
    }
    public Leave(LeaveUpdateDTO leaveUpdateDTO,User user,LeaveType leaveType){
        this.leaveType = leaveType;
        this.daysAdjusted=leaveUpdateDTO.getDaysUpdated();
        this.reason = leaveUpdateDTO.getReason();
        this.transactionType=leaveUpdateDTO.getTransactionType();
        this.user = user;
        this.status = Status.ADDED.value;
    }





}
