CREATE DEFINER=`dev`@`%` PROCEDURE `add_std_loan`(
	IN customer_id_d int(16),
    IN loaned_amount_d decimal(20,2),
    IN inter_rate decimal(4,2),
    IN aggreed_num_inst_d int(4),
    IN branch_id_d int(5)
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
	
	insert into loan (loan_type, customer_id, loaned_amount, loan_interrest_rate, aggreed_num_installements, finished_num_installements)
	values ("STANDARD", customer_id_d, loaned_amount_d, inter_rate, aggreed_num_inst_d, 0);

	insert into standard_loan (loan_id, branch_id, state)
    values (last_insert_id(), branch_id_d, "PENDING");

	COMMIT WORK;

END