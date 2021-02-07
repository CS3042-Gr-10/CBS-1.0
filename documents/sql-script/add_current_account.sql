CREATE PROCEDURE `add_current_account`(
	IN branch_id int(5),
    IN acc_balance decimal(20,2),
    IN usr_id int(11),
    IN acc_type varchar(20)
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
    
	insert into Account (branch_id, user_id, acc_type, created_date)
    values (branch_id, user_id, acc_type, curdate());
    
    insert into SavingAccount (acc_id,  balance)
    values (last_insert_id(),  acc_balance);
    
	COMMIT WORK;
    
END