CREATE DEFINER=`u05dacvdhduk0jzi`@`%` PROCEDURE `deposit_mn_sv_scc`(
	IN amount decimal(10,2),
    IN emp_id int(16),
    IN deposit_acc_id int(32),
    OUT result int(2)
)
BEGIN

    #result : 1<- successfull / 3<- entered a negative number

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
    
		update SavingAccount
		set  acc_balance = acc_balance + amount
        where saving_acc_id = deposit_acc_id;
        
        insert into Trasaction (trans_type, amount, emp_id, date)
        value ("D", amount, emp_id, curdate());
        
        insert into Deposit (trans_id, deposit_type, deposit_acc_id)
        value (last_insert_id(), "M", deposit_acc_id);
		
        set result = 1;
        
		end leaveBlock;
    
    COMMIT WORK;
    
	select result;
    
END