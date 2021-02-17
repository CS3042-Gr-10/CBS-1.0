CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `dev`@`%` 
    SQL SECURITY DEFINER
VIEW `req_fds` AS
    SELECT 
        `fixed_deposit`.`fd_id` AS `fd_id`,
        `fixed_deposit`.`customer_id` AS `customer_id`,
        `fixed_deposit`.`acc_plan_id` AS `acc_plan_id`,
        `fixed_deposit`.`sv_acc_id` AS `sv_acc_id`,
        `fixed_deposit`.`branch_id` AS `branch_id`,
        `fixed_deposit`.`opened_date` AS `opened_date`,
        `fixed_deposit`.`balance` AS `balance`,
        `fixed_deposit`.`state` AS `state`
    FROM
        `fixed_deposit`
    WHERE
        (((TO_DAYS(CURDATE()) - TO_DAYS(`fixed_deposit`.`opened_date`)) % 30) = 0)