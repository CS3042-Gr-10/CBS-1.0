CREATE DEFINER=`dev`@`%` PROCEDURE `add_emp`(
	IN username varchar(25),
    IN password varchar(255),
    IN email varchar(100),
    IN first_name varchar(100),
	IN last_name varchar(100), 
	IN name_with_init varchar(100), 
	IN dob date, 
	IN postal_code int(8), 
	IN contact_No int(10), 
	IN NIC varchar(20), 
	IN branch_id_d int(5), 
	IN gender varchar(25), 
	IN house_no varchar(25), 
	IN street varchar(25), 
	IN city varchar(25), 
	IN post_id bit(3)
)
BEGIN
 
	declare acc_level varchar(20);
	
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
    
    if post_id = 1 then 
        set acc_level = "BANK-MANAGER";
	else
		set acc_level = "EMPLOYEE";
	end if;
    
    
    insert into user (user_type, username, password, email, acc_level)
    value ("E", username, password, email, acc_level);
    
    insert into employee (user_id, first_name, last_name, name_with_init, dob, created_date, postal_code, contact_No, NIC, branch_id, gender, house_no, street, city, post_id)
    value (last_insert_id(), first_name, last_name, name_with_init, dob, curdate(), postal_code, contact_No, NIC, branch_id_d, gender, house_no, street, city, post_id);
    
    if post_id = 1 then
		update branch
		set branch_manager = last_insert_id() 
		where branch_id = branch_id_d;
    end if;
	
    COMMIT WORK;

END