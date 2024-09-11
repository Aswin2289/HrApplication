package com.Netforce.Qger.entity;

import com.Netforce.Qger.entity.dto.requestDto.EmployeeRequestDTO;
import com.Netforce.Qger.util.CommonUtils;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.time.YearMonth;

@Entity
@Data
@Table(name = "user")
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotNull
    private String employeeId;
    private String name;

    @NotNull
    private String qid;

    @Column(name = "qid_expire", columnDefinition = "DATE DEFAULT NULL")
    private LocalDate qidExpire;

    private byte gender;
    private String nationality;
    private String qualification;
    private String jobTitle;
//    @Temporal(TemporalType.DATE)
//    @NotNull
    private String contractPeriod;
    private String password;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @ManyToOne(optional = false, fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "role_id", referencedColumnName = "id")
    private Role role;

    private Date joiningDate;
    private Integer prevExperience;
    private Integer experience;

    @NotNull
    @Pattern(regexp = "^(?!^0+$)[a-zA-Z0-9]{6,20}$", message = "PASSPORT_INVALID")
    private String passport;
    @NotNull
    private LocalDate passportExpire;
    private String license;
    private LocalDate licenseExpire;
    private byte status;
    private Date rejoiningDate;
    private Date lastEligilibleDate;
    private byte yearStatus;
    private byte department;
    @Lob
    @Column(columnDefinition="LONGBLOB")
    private byte[] image;
    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp

    private Date updatedDate;

    public enum Status {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        INACTIVE((byte) 0), ACTIVE((byte) 1),VACATION((byte) 2), EXCLUDE((byte) 3);

        public final byte value;

        Status(byte value) {
            this.value = value;
        }
    }
    public enum Department{
        OFFICE((byte)0),PRODUCTION((byte)1);
        public final byte value;
        Department(byte value) {
            this.value = value;
        }
    }
    public enum YearStatus {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        TEN((byte) 0), TWO((byte) 1),JUSTJOININED((byte) 2);

        public final byte value;

        YearStatus(byte value) {
            this.value = value;
        }
    }
    public enum Gender {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        MALE((byte) 0), FEMALE((byte) 1), OTHER((byte) 2);

        public final byte value;

        Gender(byte value) {
            this.value = value;
        }
    }
    public LocalDate getLastEligilibleDateAsLocalDate() {
        return CommonUtils.toLocalDate(lastEligilibleDate);
    }

    public void setLastEligilibleDate(Date date) {
        this.lastEligilibleDate = date;
    }

    public void setLastEligilibleDate(LocalDate localDate) {
        this.lastEligilibleDate = CommonUtils.toDate(localDate);
    }

 public User(EmployeeRequestDTO employeeRequestDTO,Role role) {
        this.employeeId = employeeRequestDTO.getEmployeeId();
        this.name = employeeRequestDTO.getName();
        this.qid = employeeRequestDTO.getQid();
        this.qidExpire = employeeRequestDTO.getQidExpire();
        this.gender = employeeRequestDTO.getGender();
        this.nationality = employeeRequestDTO.getNationality();
        this.qualification = employeeRequestDTO.getQualification();
        this.jobTitle = employeeRequestDTO.getJobTitle();
        this.contractPeriod = employeeRequestDTO.getContractPeriod();
        this.password =  employeeRequestDTO.getPassword();
        this.role = role;
        this.joiningDate = employeeRequestDTO.getJoiningDate();
        this.prevExperience = employeeRequestDTO.getPrevExperience();
        this.experience = employeeRequestDTO.getExperience();
        this.passport = employeeRequestDTO.getPassport();
        this.passportExpire = employeeRequestDTO.getPassportExpire();
        this.license = employeeRequestDTO.getLicense();
        this.licenseExpire = employeeRequestDTO.getLicenseExpire();
        this.rejoiningDate=employeeRequestDTO.getJoiningDate();
        this.status = Status.ACTIVE.value;
        this.yearStatus=YearStatus.JUSTJOININED.value;
        this.department=employeeRequestDTO.getDepartment();
 }


}
