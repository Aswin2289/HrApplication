package com.Netforce.Qger.service;

import org.springframework.scheduling.annotation.Scheduled;

public interface SchedulerService {

  void updateYearStatusUpdateScheduler();
  void addYearlyLeaveDaysScheduler();
  void updateUserStatuses();
}
