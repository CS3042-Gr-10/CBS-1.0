CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `dev`@`%` 
    SQL SECURITY DEFINER
VIEW `loan_detail` AS
    SELECT 
        `loan`.`loan_id` AS `loan_id`,
        `loan`.`loan_type` AS `loan_type`,
        `loan`.`customer_id` AS `customer_id`,
        `loan`.`loaned_amount` AS `loaned_amount`,
        `loan`.`loan_plan_id` AS `loan_plan_id`,
        GET_INST_AMOUNT(`loan`.`loaned_amount`,
                `loan`.`loan_plan_id`) AS `installment_per_month`,
        GET_NPAY_TODO(`loan`.`loan_id`) AS `delay_installements`,
        LOAN_STATE(`loan`.`loan_id`) AS `loan_state`,
        `loan`.`finished_num_installements` AS `finished_num_installements`
    FROM
        `loan`