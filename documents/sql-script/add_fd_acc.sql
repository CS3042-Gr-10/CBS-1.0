CREATE DEFINER=`dev`@`%` PROCEDURE `add_fd_acc`(
	IN customer_id_d int(16), 
	IN acc_plan_id_d int(8), 
	IN sv_acc_id_d int(32), 
	IN branch_id_d int(5), 
	IN balance_d decimal(20,2)
)
BEGIN
	DECLARE errno INT;
    declare result int(1);
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @full_error;
		rollback;
	END;
		
	set result = check_sv_owner(sv_acc_id_d, customer_id_d);
    if result = 1 then
		START TRANSACTION;
		
		insert into fixed_deposit (customer_id, acc_plan_id, sv_acc_id, branch_id, opened_date, balance, state)
		values (customer_id_d, acc_plan_id_d, sv_acc_id_d, branch_id_d, curdate(), balance_d, "ACTIVE");

		COMMIT WORK;
	end if;
	select result;
END