CREATE DEFINER=`dev`@`%` PROCEDURE `add_online_loan`(
	IN customer_id_d int(16),
    IN loaned_amount_d decimal(20,2),
    IN loan_plan_id_d int(2),
    IN fd_acc_d int(32)
)
BEGIN
# result <-  0 : fd_id and user_id does not match | 1 : requested amount accepted | 2 : 500000 maximum value loaned | 3 : not enough balance in fd
	declare result int(1);
    declare sv_acc int(32);
	DECLARE errno INT;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
		GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, 
		@errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;
		SET @full_error = CONCAT("ERROR ", @errno, " (", @sqlstate, "): ", @text);
		SELECT @full_error;
		rollback;
	END;
		
	set result = check_fd_owner(customer_id_d, fd_acc_d);
    if result = 1 then
        
        set result = check_loaned_amount(fd_acc_d, loaned_amount_d);
        if result != 0 then
			if result = 2 then
				set loaned_amount_d = 500000;
			end if;
        
			START TRANSACTION;
			
			insert into loan (loan_type, customer_id, loaned_amount, loan_plan_id, finished_num_installements)
			values ("ONLINE", customer_id_d, loaned_amount_d, loan_plan_id_d, 0);

			insert into online_loan (loan_id, created_date, fd_acc_id, state)
			values (last_insert_id(), curdate(), fd_acc_d, "NOT-PAID");
            
            select sv_acc_id into sv_acc from fixed_deposit where fd_id = fd_acc_d;
            
            update saving_account
            set acc_balance = acc_balance + loaned_amount_d
            where acc_id = sv_acc;

			COMMIT WORK;
		else
			set result = 3;
		end if;
	end if;
	select result;
END