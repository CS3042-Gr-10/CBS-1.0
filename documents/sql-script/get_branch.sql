CREATE DEFINER=`dev`@`%` FUNCTION `get_branch`(
	id int(32)
) RETURNS int(11)
    DETERMINISTIC
BEGIN
	declare  ln_type varchar(20);
    declare br_id int(5);
    
    select loan_type into ln_type from loan where loan_id = id;
    if ln_type = "STANDARD"  then
		select branch_id into br_id from standard_loan where loan_id = id;
	else
		select branch_id into br_id from fixed_deposit where  fd_id = (select fd_acc_id from online_loan where loan_id = id);
	end if;
        
	RETURN br_id;
END