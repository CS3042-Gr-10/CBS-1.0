CREATE DEFINER=`u05dacvdhduk0jzi`@`%` PROCEDURE `transfer_mn`(
	IN user_id int(11),
	IN amount decimal(10,2),
    IN emp_id int(16),
    IN from_acc int(32),
    IN to_acc int(32),
    OUT result int(2)
)
BEGIN
    #result : 1 <- successfull / 0 <- not enough account balance / 3 <- entered a negative number
	# deposit_type, withdraw_type : 00 <- direct process / 01 <- tranfer process

	declare balance numeric(10,2);
    
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
    leaveBlock:begin
    
    if amount <= 0
		then 
			set result = 3;
			leave leaveBlock;
	end if;
    
	select acc_balance into balance from SavingAccount where saving_acc_id = account_id;
    set balance = balance - amount;
    
    if balance > 0
		then
    
		update SavingAccount
		set acc_balance = acc_balance - amount 
		where saving_acc_id = from_acc;
		# add a triger to check the balance > 0
    
		insert into Transaction (trans_type, amount, emp_id, date)
		values ('T', amount, emp_id, curdate());
        
        insert into Transfer (trans_id, from_acc_id, to_acc_id)
        value (last_insert_id(), from_acc, to_acc);
    
		insert into Withdrawl (trans_id, acc_id, withdrawl_type, withdrawer_id)
		values (last_insert_id(), from_acc, 01, user_id);
        
        insert into Deposit (trans_id, deposit_type, acc_id)
        value (last_insert_id(), 01, to_acc);
        
		set result = 1;
    
    else
		set result = 0;
    end if;
    
    end leaveBlock;
    
    COMMIT WORK;
    
	select result;


END