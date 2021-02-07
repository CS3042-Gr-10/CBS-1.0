CREATE PROCEDURE `add_customer`(
	IN username varchar(25),
    IN password varchar(255),
    IN email varchar(100),
	IN first_name varchar(100),
	IN last_name varchar(100),
	IN name_with_init varchar(100), 
	IN dob date,
	IN NIC varchar(20),
	IN gender varchar(25),
	IN house_no varchar(25), 
	IN street varchar(25),
	IN city varchar(25),
	IN postal_code int(8), 
	IN contact_primary int(10),
	IN contact_secondary int(10),
    IN acc_level varchar(20)
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
    
	insert into User (user_type, username, password, email, acc_level)
    value ("A", username, password, email, acc_level);
    
    insert into AccountOwner (user_id, owner_type)
    values (last_insert_id(), "U");
    
	insert into Customer (user_id ,first_name, last_name, name_with_init, dob, created_date, NIC, gender, house_no, street, city, postal_code, contact_primary, contact_secondary)
	values (last_insert_id(), first_name, last_name, name_with_init, dob, curdate(), NIC, gender, house_no, street, city, postal_code, contact_primary, contact_secondary);
    
    COMMIT WORK;
    
END