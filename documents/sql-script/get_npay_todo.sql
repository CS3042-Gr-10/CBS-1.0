CREATE DEFINER=`dev`@`%` FUNCTION `get_npay_todo`(
	loan_id_d int(32)
) RETURNS int(11)
    DETERMINISTIC
BEGIN
	declare loan_tp varchar(20);
    declare start_date date;
    declare num_payd int(3);
    declare months int(3);
    declare result int(2);
    declare st varchar(20);
    
	select loan_type into loan_tp from loan where loan_id = loan_id_d;
    
    if loan_tp = "STANDARD" then
		select state into st from standard_loan where loan_id = loan_id_d;
		select accepted_date into start_date from standard_loan where loan_id = loan_id_d;
        if st = "PENDING" or st = "COMPLETE" or st = "REJECTED" then 
			set num_payd = -1;
		else
			set num_payd = period_diff(curdate(), start_date);
		end if;
	else
		select state into st from online_loan where loan_id = loan_id_d;
		select created_date into start_date from online_loan where loan_id = loan_id_d;
        if st = "COMPLETE" then
			set num_payd = -1;
		else 
			set num_payd = period_diff(curdate(), start_date);
		end if;
	end if;
    select finished_num_installements into months from loan where loan_id = loan_id_d;
	if num_payd = -1 then
		set result = -1;
	else
		set result = num_payd - months;
	end if;
    
	RETURN result;
END