delimiter |

CREATE EVENT add_inter_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'deposit interrest of fixed deposits into linked savings account.'
    DO
      BEGIN
		DECLARE n INT DEFAULT 0;
		DECLARE i INT DEFAULT 0;
    declare sv_id int(32);
    declare ins_rate decimal(4,2);
    declare balance_i decimal(20,2);
        		
		SELECT COUNT(*) FROM req_fds INTO n;
		SET i=0;
		WHILE i<n DO 
        
		  select interest_rate_per_mon into ins_rate from fd_account_paln where fd_plan_id = (select acc_plan_id from req_fds limit i,1);
          
          select sv_acc_id into sv_id from req_fds limit i,1;
          
          select balance into balance_i from req_fds limit i,1;
          
          set balance_i = balance_i * ins_rate ;
          
          update saving_account
          set acc_balance = acc_balance + balance_i
          where acc_id = sv_id;
          
		  SET i = i + 1;
          
		END WHILE;
      END |

delimiter ;

