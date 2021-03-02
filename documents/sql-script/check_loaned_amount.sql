CREATE DEFINER=`dev`@`%` FUNCTION `check_loaned_amount`(
	fd_id_d int(32),
    amount decimal(20,2)
) RETURNS int(1)
    DETERMINISTIC
BEGIN
# result <- 1 : requested amount accepted | 2 : 500000 maximum value loaned | 0 : not enough money in fd
	declare result int(1);
    declare fd_max decimal(20,2);
    select balance into fd_max from fixed_deposit where fd_id = fd_id_d;
    
    set fd_max = fd_max*0.6;
    if amount < fd_max then
		if amount > 500000 then
			set result = 2;
		else
			set result = 1;
		end if;
	else
		set result = 0;
	end if;
	RETURN result;
END