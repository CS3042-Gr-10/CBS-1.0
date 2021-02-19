CREATE DEFINER=`dev`@`%` PROCEDURE `loan_payment`(
	 IN loan_id_d int(32)     
)
BEGIN
	declare amt decimal(20,2);
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
    
    select installment_per_month into amt from loan_detail where loan_id = loan_id_d;
    
    insert into transaction (trans_type, amount, date)
    value ("LOAN", amt, curdate());
    
    insert into loan_payment (trans_id, loan_id) value (last_insert_id() ,loan_id_d);
    
    update loan 
    set finished_num_installements = finished_num_installements + 1
    where loan_id = loan_id_d;
    
    select update_loan_st(loan_id_d);
    
    COMMIT WORK;
END