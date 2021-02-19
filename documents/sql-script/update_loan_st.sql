CREATE DEFINER=`dev`@`%` FUNCTION `update_loan_st`(
	loan_id_d int(32)
) RETURNS int(11)
    DETERMINISTIC
BEGIN
	declare loan_tp varchar(20);
    declare num_payd int(3);
    declare start_date date;
    declare fin_ints int(3);
    declare plan int(2);
    declare max_mon int(3);
    
    select loan_type into loan_tp from loan where loan_id = loan_id_d;
    select finished_num_installements into fin_ints from loan where loan_id = loan_id_d;
    select loan_plan_id into plan from loan where loan_id = loan_id_d;
    select period into max_mon from loan_plan where loan_plan_id = plan;
    
    if loan_tp = "STANDARD" then
		select accepted_date into start_date from standard_loan where loan_id = loan_id_d;
		set num_payd = period_diff(curdate(), start_date);
        if max_mon = fin_ints then
			update standard_loan 
            set state = "COMPLETE"
            where loan_id = loan_id_d;
		else 
			if fin_ints = num_payd then
				update standard_loan 
				set state = "PAID"
				where loan_id = loan_id_d;
			else
				update standard_loan 
				set state = "NOT-PAID"
				where loan_id = loan_id_d;
			end if;
		end if;
	else
		select created_date into start_date from online_loan where loan_id = loan_id_d;
		set num_payd = period_diff(curdate(), start_date);
        if max_mon = fin_ints then
			update standard_loan 
            set state = "COMPLETE"
            where loan_id = loan_id_d;
		else 
			if fin_ints = num_payd then
				update standard_loan 
				set state = "PAID"
				where loan_id = loan_id_d;
			else
				update standard_loan 
				set state = "NOT-PAID"
				where loan_id = loan_id_d;
			end if;
		end if;
	end if;
	RETURN 1;
END