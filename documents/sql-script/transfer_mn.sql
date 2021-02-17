CREATE DEFINER=`dev`@`%` PROCEDURE `transfer_mn`(
	IN user_id_d int(11),
	IN amount_d decimal(10,2),
    IN from_acc_d int(32),
    IN to_acc_d int(32)
)
BEGIN
    #result : 1 <- successfull / 0 <- not enough account balance / 3 <- entered a negative number
	# deposit_type, withdraw_type : 00 <- direct process / 01 <- tranfer process

	declare balance numeric(10,2);
    declare result int(1);
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
    
    if amount_d <= 0 then 
			set result = 3;
			leave leaveBlock;
	end if;
    
    set balance = check_balance(from_acc_d, amount_d);
    
    if balance > 0 then
		
        set result = check_sv_owner(from_acc_d, user_id_d);
        if result = 0 then
			set result = 4;
            leave leaveBlock;
		end if;
		update saving_account
		set acc_balance = balance
		where acc_id = from_acc_d;
		# add a triger to check the balance > 0
    
		insert into transaction (trans_type, amount, date)
		values ("TRANSFER", amount_d, curdate());
        
        insert into transfer (trans_id, from_acc_id, to_acc_id)
        value (last_insert_id(), from_acc_d, to_acc_d);
    
		insert into withdraw (trans_id, acc_id, withdraw_type)
		values (last_insert_id(), from_acc_d, "TRANSFER");
        
        insert into deposit (trans_id, deposit_type, acc_id)
        value (last_insert_id(), "TRANSFER", to_acc_d);
        
		set result = 1;
    
    else
		set result = 0;
    end if;
    
    end leaveBlock;
    
    COMMIT WORK;
    
	select result;
END