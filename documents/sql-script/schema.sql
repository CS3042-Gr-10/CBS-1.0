
CREATE TABLE `Session`(
  `session_id` varchar(128) not NULL,
  `expires` int(11) unsigned not NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
);

CREATE TABLE `User` (
  `user_id` INT(11) not NULL AUTO_INCREMENT,
  `user_type` char(1) not NULL,
  `username` varchar(25) not NULL UNIQUE,
  `password` varchar(255) not NULL,
  `acc_level` int(8) not NULL,
  `is_deleted` BIT(2) not NULL Default 0,
  PRIMARY KEY (`user_id`),
  Check (user_type in ('E','A'))
);

CREATE TABLE `AccountOwner` (
  `owner_id` INT(11) not NULL,
  `owner_type` char(1) not NULL,
  PRIMARY KEY (`owner_id`),
  FOREIGN KEY (owner_id) REFERENCES User(user_id),
  Check (owner_type in ('O','U'))
);

CREATE TABLE `Branch` (
  `branch_id` int(5) not NULL AUTO_INCREMENT,
  `branch_name` varchar(100),
  `street` varchar(25) not NULL,
  `city` varchar(25) not NULL,
  `postal_code` int(8) not NULL,
  `address` varchar(200) AS (concat_ws(street,'/', city, '[', postal_code, ']')),
  `grade` int(3),
  `branch_manager` INT(11),
  `is_deleted` BIT(2) not NULL Default 0, 
  PRIMARY KEY (`branch_id`)
);

CREATE TABLE `Post` (
  `post_id` BIT(3) not NULL,
  `post_name` varchar(25) not NULL,
  `salary` Numeric(8,2),
  PRIMARY KEY (`post_id`)
);

CREATE TABLE `Customer` (
  `customer_id` INT(11) not NULL,
  `name` varchar(100) not NULL,
  `first_name` varchar(25),
  `last_name` varchar(25),
  `full_name` varchar(100) AS (concat_ws(first_name,' ', last_name)),
  `dob` date not NULL,
  `create_date` date not NULL,
  `NIC` varchar(20),
  `gender` varchar(25),
  `house_no` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25),
  `post_id` BIT(3) not NULL,
  PRIMARY KEY (`customer_id`),
  constraint fk_customer_id FOREIGN KEY (customer_id) REFERENCES AccountOwner (owner_id)
);

CREATE TABLE `Employee` (
  `emp_id` INT(11) not NULL,
  `name` varchar(100) not NULL,
  `first_name` varchar(25),
  `last_name` varchar(25),
  `full_name` varchar(100) AS (concat_ws(first_name,' ', last_name)),
  `dob` Date not NULL,
  `create_date` date not NULL,
  `postal_code` int(8) not NULL,
  `NIC` varchar(20) not NULL UNIQUE,
  `branch_id` int(5) not NULL,
  `gender` varchar(25),
  `house_no` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25),
  `post_id` BIT(3) not NULL,
  PRIMARY KEY (`emp_id`),
  constraint fk_emp FOREIGN KEY (emp_id) REFERENCES User (user_id),
  FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

ALTER TABLE Branch add CONSTRAINT branch_manager_fk
  FOREIGN KEY  (branch_manager)
  REFERENCES Employee (emp_id)
  ON DELETE RESTRICT                            
  ON UPDATE RESTRICT;

CREATE TABLE `Organization` (
  `org_id` int(8) not NULL,
  `name` varchar(25) not NULL,
  `branch_id` int(5) not NULL,
  `created_date` date not NULL,
  PRIMARY KEY (`org_id`),
  FOREIGN KEY (org_id) REFERENCES AccountOwner (owner_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id)
);

CREATE TABLE `Account` (
  `acc_id` INT(32) not NULL AUTO_INCREMENT,
  `branch_id` int(5) not NULL,
  `manager_id` INT(11),
  `user_id` INT(11) not NULL,
  `acc_type` int(2) not NULL,
  `created date` Date not NULL,
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id),
  FOREIGN KEY (manager_id) REFERENCES Employee (emp_id),
  FOREIGN KEY (user_id) REFERENCES AccountOwner (owner_id)
);

CREATE TABLE `SavingAccoutPlan` (
  `acc_plan_id` int(8) not NULL AUTO_INCREMENT,
  `name` varchar(25) not NULL,
  `min_age` int(8),
  `max_age` int(8),
  `interest_rate` int(8),
  `min_balance_to_open` int(8),
  `maximum_num_wt` int(3),
  PRIMARY KEY (`acc_plan_id`)
);

CREATE TABLE `SavingAccount` (
  `saving_acc_id` INT(32) not NULL,
  `acc_plan_id` int(4) not NULL,
  `acc_balance` Numeric(20,2),
  PRIMARY KEY (`saving_acc_id`),
  FOREIGN KEY (saving_acc_id) REFERENCES Account (acc_id),
  FOREIGN KEY (acc_plan_id) REFERENCES SavingAccoutPlan (acc_plan_id)
);

CREATE TABLE `Current Deposit` (
  `current_acc_id` INT(32) not NULL,
  `remaining_balance` Numeric(20,2),
  `state` int(4) not NULL,
  PRIMARY KEY (`current_acc_id`),
  FOREIGN KEY (current_acc_id) REFERENCES Account (acc_id)
);

CREATE TABLE `FDAccountPlan` (
  `fd_plan_id` int(8) not NULL AUTO_INCREMENT,
  `name` varchar(25) not NULL,
  `duration` int(8),
  `interest_rate_per_mon` Numeric(4,2),
  PRIMARY KEY (`fd_plan_id`)
);

CREATE TABLE `FixedDeposit` (
  `fd_id` INT(32) not NULL AUTO_INCREMENT,
  `cusotmer_id` int(16) not NULL,
  `acc_plan_id` int(8) not NULL,
  `sv_acc_id` int(32) not NULL,
  `branch_id` int(5) not NULL,
  `opened_date` Date,
  `balance` Numeric(20,2),
  PRIMARY KEY (`fd_id`),
  FOREIGN KEY (cusotmer_id) REFERENCES AccountOwner (owner_id),
  FOREIGN KEY (acc_plan_id) REFERENCES  FDAccountPlan (fd_plan_id),
  FOREIGN KEY (sv_acc_id) REFERENCES SavingAccount (saving_acc_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id)
);

CREATE TABLE `Loan` (
  `loan_id` INT(32) not NULL AUTO_INCREMENT,
  `requested_date` Date,
  `accepted_date` Date,
  `loan_init_type` int(2) not NULL,
  `customer_id` int(16) not NULL,
  `loaned_amount` Numeric(20,2) not NULL,
  `state` int(4) not NULL,
  `sv_acc_id` int(32) not NULL,
  `loan_interrest_rate` Numeric(4,2),
  `num_mon_paid` int(8) not NULL Default 0,
  `branch_id` int(5) not NULL,
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (customer_id) REFERENCES AccountOwner (owner_id),
  FOREIGN KEY (sv_acc_id) REFERENCES SavingAccount (saving_acc_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id)
);

CREATE TABLE `Transaction` (
  `trans_id` int(64) not NULL AUTO_INCREMENT,
  `trans_type` char(1) not NULL,
  `amount` Numeric(10,2) not NULL,
  `date` timestamp,
  PRIMARY KEY (`trans_id`)
);

CREATE TABLE `Cheque` (
  `cheque_id` int(48) not NULL AUTO_INCREMENT,
  `amount` Numeric(10,2) not NULL,
  `from_id` int(32) not NULL,
  `to_id` int(32) not NULL,
  `date` timestamp,
  PRIMARY KEY (`cheque_id`),
  FOREIGN KEY (from_id) REFERENCES Account (acc_id),
  FOREIGN KEY (to_id) REFERENCES Account (acc_id)
);

CREATE TABLE `Deposit` (
  `trans_id` int(48) not NULL,
  `depositer_type` BIT(2) not NULL,
  `cheque_id` int(48) ,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (cheque_id) REFERENCES Cheque (cheque_id)
);

CREATE TABLE `Withdrawl` (
  `trans_id` int(48) not NULL,
  `acc_id` int(32) not NULL,
  `withdrawl_type` BIT(2) not NULL,
  `withdrawer_id` INT(11) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (acc_id) REFERENCES Account (acc_id),
  FOREIGN KEY (withdrawer_id) REFERENCES AccountOwner (owner_id)
);

CREATE TABLE `Transfer` (
  `trans_id` int(48) not NULL,
  `from_acc_id` int(32) not NULL,
  `to_acc_id` int(32) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (from_acc_id) REFERENCES SavingAccount (saving_acc_id),
  FOREIGN KEY (to_acc_id) REFERENCES SavingAccount (saving_acc_id)
);

