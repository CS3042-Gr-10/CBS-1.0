CREATE DEFINER=`dev`@`%` PROCEDURE `loan_payment`(
	 IN loan_id_d int(32)     
)
BEGIN
	declare loan_tp varchar(20);
    declare num_payd int(3);
    declare start_date date;
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
    
    insert into loan_payment (loan_id) value (loan_id_d);
    
    update loan 
    set finished_num_installements = finished_num_installements + 1
    where loan_id = loan_id_d;
    
    select loan_type into loan_tp from loan where loan_id = loan_id_d;
    
    if loan_tp = "STANDARD" then
		select accepted_date into start_date from standard_loan where loan_id = loan_id_d;
		set num_payd = period_diff(curdate(), start_date);
        if finished_num_installements = num_payd then
			update standard_loan 
            set state = "PAID"
            where loan_id = loan_id_d;
		else
			update standard_loan 
            set state = "NOT-PAID"
            where loan_id = loan_id_d;
		end if;
	else
		select created_date into start_date from online_loan where loan_id = loan_id_d;
        set num_payd = period_diff(curdate(), start_date);
        if finished_num_installements = num_payd then
			update online_loan 
            set state = "PAID"
            where loan_id = loan_id_d;
		else
			update online_loan 
            set state = "NOT-PAID"
            where loan_id = loan_id_d;
		end if;
	end if;
    COMMIT WORK;
END