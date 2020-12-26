
CREATE TABLE `User` (
  `user_id` INT(11) not NULL AUTO_INCREMENT,
  `user_type` char(1) not NULL,
  `username` varchar(25) not NULL,
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

-------------------------------------------------------------------------------------------------------------------------------------------------

CREATE TABLE `Current Deposit` (
  `crr_acc_id` int(32),
  `remaining_balance` int(64),
  `state()` int(8),
  `` <type>,
  `` <type>,
  `` <type>,
  KEY `PK,FK ` (`crr_acc_id`)
);

CREATE TABLE `Loan` (
  `loan_id` int(32),
  `accepted_date` datetime,
  `loan_init_type` Bool,
  `customer_id` int(16),
  `loaned_amount` int(16),
  `state()` int(8),
  `sv_acc_id` int(32),
  `loan_interrest_rate` int(8),
  `#mon_paid` int(8),
  `branch_id` int(8),
  `requested_date` datetime,
  `` <type>,
  KEY `PK ` (`loan_id`)
);

CREATE TABLE `Deposit` (
  `trans_id` int(64),
  `depositer_type` bool,
  `depositer_id` int(64),
  PRIMARY KEY (`trans_id`)
);

CREATE TABLE `Account` (
  `sv_acc_id` int(32),
  `branch_id` int(8),
  `manager_id` int(16),
  `customer_type` bool,
  `user_id` int(16),
  `acc_type` int(8),
  `created date` datetime,
  KEY `PK,` (`sv_acc_id`)
);

CREATE TABLE `Saving Accout Plan` (
  `acc_plan_id` int(8),
  `min_age` int(8),
  `max_age` int(8),
  `interest_rate` int(8),
  `min_balance_to_open` int(8),
  `name` varchar(25),
  `maximum_num_wt` int(3),
  PRIMARY KEY (`acc_plan_id`)
);

CREATE TABLE `Transfer` (
  `trans_id` int(64),
  `from_acc_id` int(32),
  `to_acc_id` int(32),
  PRIMARY KEY (`trans_id`)
);

CREATE TABLE `Organization` (
  `org_id` int(8),
  `name` varchar(25),
  `branch_id` int(8),
  `created_date` timestamp,
  `{customer_id}` int(16),
  PRIMARY KEY (`org_id`)
);

CREATE TABLE `Branch` (
  `branch_id` int(8),
  `location` <type>,
  `   -street ` varchar(25),
  `   -city` varchar(25),
  `postal_code` int(8),
  `grade` int(8),
  `branch_manager()` int(16),
  PRIMARY KEY (`branch_id`)
);

CREATE TABLE `Withdrawl` (
  `trans_id` int(64),
  `acc_id` int(32),
  `withdrawl_type` int(8),
  `withdrawer_id` int(64),
  PRIMARY KEY (`trans_id`)
);

CREATE TABLE `Employee` (
  `emp_id` int(16),
  `name` <type>,
  `   -first_name` varchar(25),
  `   -last_name` varchar(25),
  `dob` datetime,
  `age()` int(8),
  `create_date` datetime,
  `postal_code` int(8),
  `NIC` varchar(20),
  `branch_id` int(8),
  `gender` varchar(25),
  `address` <type>,
  `   -street` varchar(25),
  `   -city` varchar(25),
  `post_id` int(8),
  PRIMARY KEY (`emp_id`)
);

CREATE TABLE `Saving Account ` (
  `saving_acc_id` int(8),
  `acc_plan_id` varchar(25),
  `acc_balance` int(16),
  `` <type>,
  `` <type>,
  PRIMARY KEY (`saving_acc_id`)
);

CREATE TABLE `FD Account Plan` (
  `fd_plan_id` int(8),
  `name` varchar(25),
  `duration` int(8),
  `interest_rate_per_mon` int(8),
  `` <type>,
  `` <type>,
  `` <type>,
  PRIMARY KEY (`fd_plan_id`)
);

CREATE TABLE `Customer` (
  `customer_id` int(16),
  `name` <type>,
  `   -first_name` varchar(25),
  `   -last_name` varchar(25),
  `dob` datetime,
  `age()` int(8),
  `create_date` datetime,
  `postal_code` int(8),
  `NIC` varchar(20),
  `gender` varchar(25),
  `address` <type>,
  `   -street` varchar(25),
  `   -city` varchar(25),
  `` <type>,
  PRIMARY KEY (`customer_id`)
);


CREATE TABLE `Check` (
  `check_id` int(64),
  `amount` int(32),
  `from_id` int(32),
  `to_id` int(32),
  `date` datetime,
  `` <type>,
  PRIMARY KEY (`check_id`)
);

CREATE TABLE `Fixed Deposit` (
  `fd_id` int(32),
  `cusotmer_id` int(16),
  `acc_plan_id` int(8),
  `sv_acc_id` int(32),
  `opened_date` datetime,
  `branch_id` int(8),
  `` <type>,
  `` <type>,
  `` <type>,
  PRIMARY KEY (`fd_id`)
);

CREATE TABLE `Transaction` (
  `trans_id` int(64),
  `trans_type` int(8),
  `amount` int(32),
  `date` datatime,
  `` <type>,
  `` <type>,
  PRIMARY KEY (`trans_id`)
);

