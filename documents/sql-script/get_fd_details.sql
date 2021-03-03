CREATE DEFINER=`dev`@`%` PROCEDURE `get_fd_details`(IN id int(32))
BEGIN
    declare fd_plan int(8);
    select acc_plan_id into fd_plan from fixed_deposit where fd_id = id;
	
	select * from (select * from fixed_deposit where fd_id = id) P natural join (select * from fd_account_plan where fd_plan_id = fd_plan) Q;
	
END