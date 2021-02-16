CREATE DEFINER=`dev`@`%` FUNCTION `check_fd_owner`(
	user_id int(11),
    fd_id_d int(32)
) RETURNS int(1)
    DETERMINISTIC
BEGIN
# result <- 1 : valid fd_acc | 0 : fd_id and user_id does not match.
	declare user int(11);
    declare result int(1);
    select customer_id into user from fixed_deposit where fd_id = fd_id_d;
    if user = user_id then
		set result = 1;
	else
		set result = 0;
	end if;

	RETURN result;
END