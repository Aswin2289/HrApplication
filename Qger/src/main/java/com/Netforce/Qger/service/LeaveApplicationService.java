package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.dto.requestDto.LeaveRequestDTO;

public interface LeaveApplicationService {
    void addLeaveApplication(LeaveRequestDTO leaveRequestDTO);

    void deleteLeaveApplication(Integer id);

    void updateLeaveApplication(Integer id,LeaveRequestDTO leaveRequestDTO);
}
