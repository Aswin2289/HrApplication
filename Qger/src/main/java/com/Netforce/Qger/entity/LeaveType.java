package com.Netforce.Qger.entity;

import com.Netforce.Qger.entity.dto.requestDto.LeaveTypeRequestDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
public class LeaveType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 50, unique = true)
    private String name;

    private byte status;

    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;
    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updatedDate;

    private Integer orderCount;

    private Integer totalLeave;

    public enum Status {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        INACTIVE((byte) 0), ACTIVE((byte) 1),DELETED((byte) 2);

        public final byte value;

        Status(byte value) {
            this.value = value;
        }
    }

    public LeaveType(LeaveTypeRequestDTO leaveTypeRequestDTO){
        this.name = leaveTypeRequestDTO.getName();
        this.status = Status.ACTIVE.value;
    }
}
