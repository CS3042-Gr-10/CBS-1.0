CREATE DEFINER=`dev`@`%` FUNCTION `get_inst_amount`(
	loaned_amount decimal(20,2),
    loan_plan_id int(2)
) RETURNS decimal(10,2)
BEGIN
	declare total_pay decimal(22,2);
    declare ints decimal(20,2);
    declare ints_rate decimal(4,2);
    declare months int(3);
    
    set total_pay = loaned_amount*(1+ints_rate);
    set ints = total_pay/months;
    
	RETURN ints;
END