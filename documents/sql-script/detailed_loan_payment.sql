CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `dev`@`%` 
    SQL SECURITY DEFINER
VIEW `detailed_loan_payment` AS
    SELECT 
        `loan_payment`.`trans_id` AS `trans_id`,
        `loan_payment`.`loan_id` AS `loan_id`,
        GET_BRANCH(`loan_payment`.`loan_id`) AS `get_branch(loan_id)`,
        `transaction`.`trans_type` AS `trans_type`,
        `transaction`.`amount` AS `amount`,
        `transaction`.`date` AS `branch`
    FROM
        (`loan_payment`
        JOIN `transaction` ON ((`loan_payment`.`trans_id` = `transaction`.`trans_id`)))
    WHERE
        (`transaction`.`is_deleted` = 0)