CREATE TABLE `session`(
  `session_id` varchar(128) not NULL,
  `expires` int(11) unsigned not NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
);

CREATE TABLE `user` (
  `user_id` INT(11) not NULL AUTO_INCREMENT,
  `user_type` char(1) not NULL,
  `username` varchar(25) not NULL UNIQUE,
  `password` varchar(255) not NULL,
  `email` varchar(100) not NULL,
  `acc_level` varchar(20) not NULL,
  `is_deleted` INT(2) not NULL Default 0,
  PRIMARY KEY (`user_id`),
  Check (user_type in ('E','A')),
  Check (acc_level in ("CUSTOMER", "EMPLOYEE","BANK-MANAGER"))
);

CREATE TABLE `account_owner` (
  `user_id` INT(11) not NULL,
  `owner_type` char(1) not NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (user_id) REFERENCES user(user_id),
  Check (owner_type in ('O','U'))
);

CREATE TABLE `branch` (
  `branch_id` int(5) not NULL AUTO_INCREMENT,
  `branch_name` varchar(100),
  `street` varchar(25) not NULL,
  `city` varchar(25) not NULL,
  `postal_code` int(8) not NULL,
  `grade` int(3),
  `branch_manager` INT(11),
  `contact_No` int(10) unsigned,
  `is_deleted` int(2) not NULL Default 0, 
  PRIMARY KEY (`branch_id`)
);

CREATE TABLE `post` (
  `post_id` INT(2) not NULL,
  `post_name` varchar(25) not NULL,
  `salary` Numeric(8,2),
  PRIMARY KEY (`post_id`)
);

CREATE TABLE `customer` (
  `user_id` INT(11) not NULL,
  `first_name` varchar(100) not NULL,
  `last_name` varchar(100),
  `name_with_init` varchar(100) not NULL,
  `dob` date not NULL,
  `created_date` date not NULL,
  `NIC` varchar(20) not NULL UNIQUE,
  `gender` varchar(25),
  `house_no` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25),
  `postal_code` int(8),
  `contact_primary` int(10),
  `contact_secondary` int(10),
  PRIMARY KEY (`user_id`),
  constraint fk_customer_id FOREIGN KEY (user_id) REFERENCES account_owner (user_id)
);

CREATE TABLE `employee` (
  `user_id` INT(11) not NULL,
  `first_name` varchar(100) not NULL,
  `last_name` varchar(100) not NULL,
  `name_with_init` varchar(100) not NULL,
  `dob` Date not NULL,
  `created_date` date not NULL,
  `postal_code` int(8) not NULL,
  `contact_No` int(10),
  `NIC` varchar(20) not NULL UNIQUE,
  `branch_id` int(5) not NULL,
  `gender` varchar(25),
  `house_no` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25),
  `post_id` INT(2) not NULL,
  PRIMARY KEY (`user_id`),
  constraint fk_emp FOREIGN KEY (user_id) REFERENCES user (user_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id),
  FOREIGN KEY (post_id) REFERENCES post(post_id)
);

ALTER TABLE branch add CONSTRAINT branch_manager_fk
  FOREIGN KEY  (branch_manager)
  REFERENCES employee (user_id)
  ON DELETE RESTRICT                            
  ON UPDATE RESTRICT;

CREATE TABLE `organization` (
  `user_id` int(8) not NULL,
  `name` varchar(25) not NULL,
  `reg_number` varchar(100) not NULL UNIQUE,
  `contact_No` int(10),
  `branch_id` int(5) not NULL,
  `created_date` date not NULL,
  `house_No` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25) not NULL,
  `postal_code` int(6) not NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (user_id) REFERENCES account_owner (user_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE `account` (
  `acc_id` INT(32) not NULL AUTO_INCREMENT,
  `branch_id` int(5) not NULL,
  `user` INT(11) not NULL,
  `acc_type` varchar(20) not NULL,
  `created_date` Date not NULL,
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id),
  FOREIGN KEY (user) REFERENCES account_owner (user_id),
  Check (acc_type in ("SAVINGS", "CURRENT"))
);

CREATE TABLE `saving_account_plan` (
  `acc_plan_id` int(8) not NULL AUTO_INCREMENT,
  `name` varchar(25) not NULL,
  `min_age` int(8),
  `max_age` int(8),
  `interest_rate` int(8),
  `min_balance_to_open` int(8),
  `maximum_num_wt` int(3),
  PRIMARY KEY (`acc_plan_id`)
);

CREATE TABLE `saving_account` (
  `acc_id` INT(32) not NULL,
  `num_monthly_wt` int(3) not NULL Default 0,
  `acc_plan_id` int(4) not NULL,
  `acc_balance` Numeric(20,2),
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (acc_id) REFERENCES account (acc_id),
  FOREIGN KEY (acc_plan_id) REFERENCES saving_accout_plan (acc_plan_id)
);

CREATE TABLE `current_deposit` (
  `acc_id` INT(32) not NULL,
  `remaining_balance` Numeric(20,2),
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (acc_id) REFERENCES account (acc_id)
);

CREATE TABLE `fd_account_plan` (
  `fd_plan_id` int(8) not NULL AUTO_INCREMENT,
  `name` varchar(25) not NULL,
  `duration` int(8),
  `interest_rate_per_mon` Numeric(4,2),
  PRIMARY KEY (`fd_plan_id`)
);

CREATE TABLE `fixed_deposit` (
  `fd_id` INT(32) not NULL AUTO_INCREMENT,
  `customer_id` int(11) not NULL,
  `acc_plan_id` int(8) not NULL,
  `sv_acc_id` int(32) not NULL,
  `branch_id` int(5) not NULL,
  `opened_date` Date,
  `balance` Numeric(20,2),
  `state` INT(2),
  PRIMARY KEY (`fd_id`),
  FOREIGN KEY (cusotmer_id) REFERENCES account_owner (user_id),
  FOREIGN KEY (acc_plan_id) REFERENCES  fd_account_plan (fd_plan_id),
  FOREIGN KEY (sv_acc_id) REFERENCES saving_account (acc_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id)
);

CREATE TABLE `loan` (
  `loan_id` INT(32) not NULL AUTO_INCREMENT,
  `loan_type` varchar(20) not NULL,
  `customer_id` int(11) not NULL,
  `loaned_amount` Numeric(20,2) not NULL,
  `loan_plan_id` int(2) not NULL,
  `finished_num_installements` int(4) not NULL,
  `deleted` INT(2),
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (customer_id) REFERENCES account_owner (user_id),
  FOREIGN KEY (loan_plan_id) REFERENCES loan_plan (loan_plan_id),
  Check (loan_type in ("STANDARD", "ONLINE"))
);

CREATE TABLE `loan_plan` (
  `loan_plan_id` int(2) AUTO_INCREMENT,
  `loan_plan_name` varchar(100) UNIQUE not NULL,
  `interrest_rate` Numeric(4,2) not NULL,
  `period` int(3) unsigned not NULL,
  PRIMARY KEY (`loan_plan_id`)
);

CREATE TABLE `standard_loan` (
  `loan_id` int(32) not NULL,
  `branch_id` int(5) not NULL,
  `accepted_date` Date,
  `state` varchar(20) not NULL,
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (loan_id) REFERENCES loan (loan_id),
  FOREIGN KEY (branch_id) REFERENCES branch (branch_id),
  Check (state in ("PENDING", "REJECTED", "PAID", "NOT-PAID", "COMPLETE"))
);

CREATE TABLE `online_loan` (
  `loan_id` int(32) not NULL,
  `created_date` Date,
  `fd_acc_id` int(32) not NULL,
  `state` varchar(20) not NULL,
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (loan_id) REFERENCES loan (loan_id),
  FOREIGN KEY (fd_acc_id) REFERENCES fixed_deposit (fd_id),
  Check (state in ("PAID", "NOT-PAID", "COMPLETE"))
);

CREATE TABLE `transaction` (
  `trans_id` int(64) not NULL AUTO_INCREMENT,
  `trans_type` varchar(20) not NULL,
  `amount` Numeric(10,2) not NULL,
  `date` timestamp,
  `is_deleted` int(1) NOT NULL Default 0,
  PRIMARY KEY (`trans_id`),
  Check (trans_type in ("TRANSFER", "WITHDRAW", "DEPOSIT", "LOAN"))
);

CREATE TABLE `cheque` (
  `cheque_id` int(48) not NULL AUTO_INCREMENT,
  `amount` Numeric(10,2) not NULL,
  `from_id` int(32) not NULL,
  `to_id` int(32) not NULL,
  `date` timestamp,
  PRIMARY KEY (`cheque_id`),
  FOREIGN KEY (from_id) REFERENCES account (acc_id),
  FOREIGN KEY (to_id) REFERENCES account (acc_id)
);

CREATE TABLE `deposit` (
  `trans_id` int(48) not NULL,
  `deposit_type` varchar(20) not NULL,
  `acc_id` int(32),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES transaction (trans_id),
  FOREIGN KEY (acc_id) REFERENCES saving_account (acc_id),
  Check (deposit_type in ("MONEY", "CHEQUE", "TRANSFER"))
);

CREATE TABLE `cheque_deposit` (
  `trans_id` int(48) not NULL,
  `cheque_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES deposit (trans_id),
  FOREIGN KEY (cheque_id) REFERENCES cheque (cheque_id)
);

CREATE TABLE `money_deposit` (
  `trans_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES deposit (trans_id)
);

CREATE TABLE `withdraw` (
  `trans_id` int(48) not NULL,
  `acc_id` int(32) not NULL,
  `withdraw_type` varchar(20) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES transaction (trans_id),
  FOREIGN KEY (acc_id) REFERENCES account (acc_id),
  Check (withdraw_type in ("MONEY", "ATM", "TRANSFER"))
);

CREATE TABLE `money_withdraw` (
  `trans_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES withdraw (trans_id)
);

CREATE TABLE `atm_withdraw` (
  `trans_id` int(48) not NULL,
  `atm_point` int(4) not NULL,
  FOREIGN KEY (trans_id) REFERENCES withdraw (trans_id)
);

CREATE TABLE `transfer` (
  `trans_id` int(48) not NULL,
  `from_acc_id` int(32) not NULL,
  `to_acc_id` int(32) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES transaction (trans_id),
  FOREIGN KEY (from_acc_id) REFERENCES saving_account (acc_id),
  FOREIGN KEY (to_acc_id) REFERENCES saving_account (acc_id)
);

CREATE TABLE `loan_payment` (
  `trans_id` int(64),
  `loan_id` int(32),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES transaction (trans_id),
  FOREIGN KEY (loan_id) REFERENCES loan (loan_id)
);



