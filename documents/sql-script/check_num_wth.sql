CREATE DEFINER=`dev`@`%` FUNCTION `check_num_wth`(
	account_id int(32)
) RETURNS int(11)
    DETERMINISTIC
BEGIN
	declare result int(1);
	declare nums int(2);
    if nums = 5 then
		set result = 0;
	else
		set result = 1;
	end if;
	RETURN result;
END