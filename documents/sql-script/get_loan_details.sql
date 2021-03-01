CREATE DEFINER=`dev`@`%` PROCEDURE `get_loan_details`(IN loan_id_d int(32))
BEGIN
	declare ln_type varchar(20);
    declare ln_plan int(2);
    select loan_type into ln_type from loan where loan_id = loan_id_d;
    select loan_plan_id into ln_plan from loan where loan_id = loan_id_d;
	if ln_type = "STANDARD" then
		select * from (select * from loan where loan_id = loan_id_d) P natural join (select * from loan_plan where loan_plan_id = ln_plan) Q natural join (select * from standard_loan where loan_id = loan_id_d) R;
	else	
		select * from (select * from loan where loan_id = loan_id_d) P natural join (select * from loan_plan where loan_plan_id = ln_plan) Q natural join (select * from online_loan where loan_id = loan_id_d) R;
	end if;
END