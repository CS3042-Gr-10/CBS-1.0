CREATE DEFINER=`dev`@`%` PROCEDURE `deposit_mn_sv_acc`(
	IN amount decimal(10,2),
    IN emp_id int(16),
    IN deposit_acc_id int(32)
)
BEGIN

    #result : 1<- successfull / 3<- entered a negative number
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
		
		if amount <=0
			then 
				set result = 3;
				leave leaveBlock;
		end if;
    
		update saving_account
		set  acc_balance = acc_balance + amount
        where acc_id = deposit_acc_id;
        
        insert into transaction (trans_type, amount, date)
        value ("DEPOSIT", amount, curdate());
        
        insert into deposit (trans_id, deposit_type, acc_id)
        value (last_insert_id(), "MONEY", deposit_acc_id);
        
        insert into money_deposit(trans_id, emp_id)
        value (last_insert_id(), emp_id);
		
        set result = 1;
        
		end leaveBlock;
    
    COMMIT WORK;
    
	select result;
    
END