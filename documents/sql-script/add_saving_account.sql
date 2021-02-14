CREATE PROCEDURE `add_saving_account`(
	IN branch_id int(5),
    IN acc_balance decimal(20,2),
    IN usr_id int(11),
    IN account_plan_id int(8)
)
# result : 0 <- success | 1 <- init_balace is low | 2 <- age range not valid.
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
    
    set result = check_sv_plan(usr_id, acc_balance, account_plan_id);
    if result = 0 then
		START TRANSACTION;
		
		insert into Account (branch_id, user, acc_type, created_date)
		values (branch_id, usr_id, "SAVINGS", curdate());
		
		insert into SavingAccount (acc_id, acc_plan_id, acc_balance)
		values (last_insert_id(), account_plan_id, acc_balance);
		
		COMMIT WORK;
	end if;
	select result;
END