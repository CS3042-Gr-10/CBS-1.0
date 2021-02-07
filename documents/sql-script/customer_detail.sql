CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `dev`@`%` 
    SQL SECURITY DEFINER
VIEW `customer_details` AS
    SELECT 
        `Customer`.`first_name` AS `first_name`,
        `Customer`.`last_name` AS `last_name`,
        `Customer`.`dob` AS `dob`,
        `Customer`.`NIC` AS `NIC`,
        `Customer`.`gender` AS `gender`,
        `Customer`.`house_no` AS `house_no`,
        `Customer`.`street` AS `street`,
        `Customer`.`city` AS `city`,
        `Customer`.`postal_code` AS `postal_code`,
        `Customer`.`contact_primary` AS `contact_primary`,
        `Customer`.`contact_secondary` AS `contact_secondary`,
        `User`.`username` AS `username`,
        `User`.`email` AS `email`
    FROM
        (`Customer`
        JOIN `User` ON ((`Customer`.`user_id` = `User`.`user_id`)))