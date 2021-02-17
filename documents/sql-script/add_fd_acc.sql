CREATE DEFINER=`dev`@`%` FUNCTION `check_sv_owner`(
	acc_id_d int(32),
    user_id_d int(11)
) RETURNS int(11)
BEGIN
#result : 1 <- success | 0 <- user_id and saving account id does not match
	declare result int(1);
    declare act_user int(11);
    select user into act_user from account where acc_id = acc_id_d;
    if act_user = user_id_d then
		set result = 1;
	else 
		set result = 0;
	end if;
	RETURN result;
END