CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `dev`@`%` 
    SQL SECURITY DEFINER
VIEW `customer_detail` AS
    SELECT 
        `user`.`user_id` AS `user_id`,
        `customer`.`first_name` AS `first_name`,
        `customer`.`last_name` AS `last_name`,
        `customer`.`dob` AS `dob`,
        `customer`.`NIC` AS `NIC`,
        `customer`.`gender` AS `gender`,
        `customer`.`house_no` AS `house_no`,
        `customer`.`street` AS `street`,
        `customer`.`city` AS `city`,
        `customer`.`postal_code` AS `postal_code`,
        `customer`.`contact_primary` AS `contact_primary`,
        `customer`.`contact_secondary` AS `contact_secondary`,
        `user`.`username` AS `username`,
        `user`.`email` AS `email`
    FROM
        (`customer`
        JOIN `user` ON ((`customer`.`user_id` = `user`.`user_id`)))