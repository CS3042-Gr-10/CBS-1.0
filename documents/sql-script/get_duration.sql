CREATE DEFINER=`dev`@`%` FUNCTION `get_duration`(
	plan_id int(32)
) RETURNS int(8)
DETERMINISTIC
BEGIN

    declare result int(8);
        
    select duration into result from the fd_account_plan where fd_plan_id = plan_id;
    
	RETURN result;
END