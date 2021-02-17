CREATE EVENT reset_withdraw
    ON SCHEDULE
      EVERY 1 MONTH
    COMMENT 'reset number of withdraw at the end opf every month'
    DO
      update saving_account
      set num_monthly_wt = 0;