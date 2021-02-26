CREATE DEFINER=`dev`@`%` FUNCTION `update_fd_st`(
	acc_id int(32),
    st varchar(25)
) RETURNS int(1)
DETERMINISTIC
BEGIN

    declare result int(1);
        
    update fixed_deposit
    set state = st
    where fd_id = acc_id;
    
	RETURN 1;
END