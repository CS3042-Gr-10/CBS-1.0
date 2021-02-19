CREATE DEFINER=`dev`@`%` FUNCTION `get_npay_todo`(
	loan_id_d int(32)
) RETURNS int(11)
BEGIN
	declare loan_tp varchar(20);
    declare start_date date;
    declare num_payd int(3);
    declare months int(3);
    declare result int(2);
    
	select loan_type into loan_tp from loan where loan_id = loan_id_d;
    
    if loan_tp = "STANDARD" then
		select accepted_date into start_date from standard_loan where loan_id = loan_id_d;
		set num_payd = period_diff(curdate(), start_date);
	else
		select created_date into start_date from online_loan where loan_id = loan_id_d;
        set num_payd = period_diff(curdate(), start_date);
	end if;
    select finished_num_installements into months from loan_plan where loan_id = loan_id_d;
    set result = num_pyd - months;
    
	RETURN result;
END