CREATE DEFINER=`dev`@`%` FUNCTION `check_sv_plan`(
	usr_id int(11),
    amount decimal(10,2),
    plan_id int(8)
) RETURNS int(1)
    DETERMINISTIC
BEGIN
	declare user_type char(1);
    declare age int(2);
    declare min_age int(2);
    declare max_age int(2);
    declare min_amount decimal(10,2);
    declare result int(1);
    
    select owner_type into user_type from account_owner where user_id = usr_id;
    if user_type = "O" then
		select min_balance_to_open into min_amount from saving_account_plan where acc_plan_id = 5;
        if min_amount < amount then
			set result = 0;
		else 
			set result = 1;
		end if;
    else 
		select year(curdate()) - year(dob) into age from Customer where user_id = usr_id;
        select min_age, max_age into min_age, max_age from saving_account_plan where acc_plan_id = plan_id; 
        if min_age < age and max_age > age then
			select min_balance_to_open into min_amount from saving_account_plan where acc_plan_id = plan_id; 
            if min_amount < amount then
				set result = 0;
			else 
				set result = 1;
			end if;
        else
			set result = 2;
		end if;
    end if;
    
	RETURN result;
END