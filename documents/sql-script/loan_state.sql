CREATE DEFINER=`dev`@`%` FUNCTION `loan_state`(
	loan_id_d int(32)
) RETURNS varchar(20) CHARSET utf8
    DETERMINISTIC
BEGIN
	declare loan_tp varchar(20);
    declare st varchar(20);
	select loan_type into loan_tp from loan where loan_id = loan_id_d;
    
    if loan_tp = "STANDARD" then
		select state into st from standard_loan where loan_id = loan_id_d;
	else
		select state into st from online_loan where loan_id = loan_id_d;
	end if;
    
	RETURN st;
END