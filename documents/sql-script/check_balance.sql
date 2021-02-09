CREATE DEFINER=`dev`@`%` FUNCTION `check_balance`(
	account_id int(32),
    amount decimal(10,2)
) RETURNS decimal(10,2)
    DETERMINISTIC
BEGIN
	declare balance decimal(10,2);
    select acc_balance into balance from savingaccount where acc_id = account_id;
    
    set balance = balance - amount;
    if balance < 0 then
		set balance = -1;
	end if;
    
	return balance;
END