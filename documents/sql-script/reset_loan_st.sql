CREATE EVENT reset_loan_st
    ON SCHEDULE
      EVERY 1 MONTH
    COMMENT 'reset number of withdraw at the end opf every month'
    DO
      select update_loan_st(loan_id) from loan;