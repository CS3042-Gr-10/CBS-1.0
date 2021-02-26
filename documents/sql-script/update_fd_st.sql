CREATE EVENT update_fd_st
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'check weather the fixed deposit is expired.'
    DO
      select update_fd_st(fd_id, "EXPIRED") from fixed_deposit where period_diff(curdate(), opened_date) >= get_duration(acc_plan_id);
