CREATE DEFINER=`dev`@`%` PROCEDURE `withdraw_mn_sv_acc`(
	IN account_id int(32),
    IN emp_id int(16),
    IN amount decimal(10,2)
)
BEGIN

    #result : 0 <- not enough account balance | 1 <- successfull | 2 <- exceed num of withdraw  | 3 <- entered a negative number

	declare balance numeric(10,2);
    declare result INT;
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
        
        if amount <=0 then 
                set result = 3;
                leave leaveBlock;
        end if;
        
        set balance = check_balance(account_id, amount);
        
        if balance > 0 then
        
			if check_num_wth(account_id) = 1 then
        
				update saving_account
				set acc_balance = acc_balance - amount 
				where acc_id = account_id;
				
				update saving_account
				set num_monthly_wt = num_monthly_wt + 1 
				where acc_id = account_id;
			
				insert into transaction (trans_type, amount, date)
				values ("WITHDRAW", amount, curdate());
			
				insert into withdraw (trans_id, acc_id, withdraw_type)
				values (last_insert_id(), account_id, "MONEY");
				
				insert into money_withdraw (trans_id, emp_id)
				values (last_insert_id(), emp_id);
				set result = 1;
			else
				set result = 2;
			end if;
        else
            set result = 0;
        end if;
        
        end leaveBlock;
    
    COMMIT WORK;
    
	select result;
    
END