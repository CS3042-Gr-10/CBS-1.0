CREATE DEFINER=`dev`@`%` PROCEDURE `add_org`(
	IN username varchar(25),
	IN password varchar(255), 
    IN name varchar(25),
    IN contact_no int(10),
    IN branch_id int(5)
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
    
    START transaction;
    
        insert into user (user_type, username, password, acc_level)
        value ("A", username, password, "CUSTOMER");
        
        insert into account_owner (owner_id, owner_type)
        values (last_insert_id(), "O");
        
        insert into organization (name, contact_No, branch_id, created_date)
        values (last_insert_id(), contact_no, branch_id, curdate());
        
    COMMIT WORK;

END