CREATE DEFINER=`dev`@`%` PROCEDURE `accept_loan_st`(
	loan_id_d int(32),
    accept int(1)
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
    
    if accept = 1 then
		update standard_loan 
		set state = "NOT-PAID"
        where loan_id = loan_id_d;
	elseif accept = 0 then
		update standard_loan 
		set state = "REJECTED"
        where loan_id = loan_id_d;
	end if;
    COMMIT WORK;

END