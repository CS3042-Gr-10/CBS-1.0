CREATE DEFINER=`dev`@`%` PROCEDURE `add_fd`(
	IN cusotmer_id int(16),
	IN acc_plan_id int(8), 
	IN sv_acc_id int(32), 
	IN branch_id int(5), 
	IN balance decimal(20,2), 
	IN state bit(2)
)
BEGIN

	DECLARE errno INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
	GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
	@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
	SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
	SELECT @full_error;
    rollback;
	END;
    
    START TRANSACTION;
    
		insert into fixed_deposit (customer_id, acc_plan_id, sv_acc_id, branch_id, opened_date, balance, state)
		value (customer_id, acc_plan_id, sv_acc_id, branch_id, curdate(), balance, state);
		
    COMMIT WORK;

END