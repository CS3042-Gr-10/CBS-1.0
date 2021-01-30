CREATE DEFINER=`u05dacvdhduk0jzi`@`%` PROCEDURE `withdrawl_from_sv_acc`(
	IN account_id int(32),
    IN withdrawl_type BIT(2),
    IN withd_id int(11),
    IN emp_id int(16),
    IN amount decimal(10,2),
    OUT result int(2)
)
BEGIN

    #result : 1 <- successfull / 0 <- not enough account balance / 3 <- entered a negative number

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
        
        if amount <=0
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
            where saving_acc_id = account_id;
        
            insert into Transaction (trans_type, amount, emp_id, date)
            values ('W', amount, emp_id, curdate());
        
            insert into Withdrawl (trans_id, acc_id, withdrawl_type, withdrawer_id)
            values (last_insert_id(), account_id, 00, withd_id);
            set result = 1;
        
        else
            set result = 0;
        end if;
        
        end leaveBlock;
    
    COMMIT WORK;
    
	select result;
    
END