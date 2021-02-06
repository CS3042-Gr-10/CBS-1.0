

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
  `email` varchar(100) not NULL,
  `acc_level` varchar(20) not NULL,
  `is_deleted` BIT(2) not NULL Default 0,
  PRIMARY KEY (`user_id`),
  Check (user_type in ('E','A')),
  Check (acc_level in ("CUSTOMER", "EMPLOYEE","BANK-MANAGER"))
);

CREATE TABLE `AccountOwner` (
  `user_id` INT(11) not NULL,
  `owner_type` char(1) not NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (user_id) REFERENCES User(user_id),
  Check (owner_type in ('O','U'))
);

CREATE TABLE `Branch` (
  `branch_id` int(5) not NULL AUTO_INCREMENT,
  `branch_name` varchar(100),
  `street` varchar(25) not NULL,
  `city` varchar(25) not NULL,
  `postal_code` int(8) not NULL,
  `grade` int(3),
  `branch_manager` INT(11),
  `contact_No` int(10) unsigned,
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
  `user_id` INT(11) not NULL,
  `first_name` varchar(100) not NULL,
  `last_name` varchar(100),
  `name_with_init` varchar(100) not NULL,
  `dob` date not NULL,
  `created_date` date not NULL,
  `NIC` varchar(20),
  `gender` varchar(25),
  `house_no` varchar(25) not NULL,
  `street` varchar(25) not NULL,
  `city` varchar(25),
  `postal_code` int(8),
  `contact_primary` int(10),
  `contact_secondary` int(10),
  PRIMARY KEY (`user_id`),
  constraint fk_customer_id FOREIGN KEY (user_id) REFERENCES AccountOwner (user_id)
);

CREATE TABLE `Employee` (
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
  `post_id` BIT(3) not NULL,
  PRIMARY KEY (`user_id`),
  constraint fk_emp FOREIGN KEY (user_id) REFERENCES User (user_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id),
  FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

ALTER TABLE Branch add CONSTRAINT branch_manager_fk
  FOREIGN KEY  (branch_manager)
  REFERENCES Employee (user_id)
  ON DELETE RESTRICT                            
  ON UPDATE RESTRICT;

CREATE TABLE `Organization` (
  `user_id` int(8) not NULL,
  `name` varchar(25) not NULL,
  `contact_No` int(10),
  `branch_id` int(5) not NULL,
  `created_date` date not NULL,
  PRIMARY KEY (`user_id`),
  FOREIGN KEY (user_id) REFERENCES AccountOwner (user_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id)
);

CREATE TABLE `Account` (
  `acc_id` INT(32) not NULL AUTO_INCREMENT,
  `branch_id` int(5) not NULL,
  `manager_id` INT(11),
  `user_id` INT(11) not NULL,
  `acc_type` varchar(20) not NULL,
  `created_date` Date not NULL,
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id),
  FOREIGN KEY (manager_id) REFERENCES Employee (user_id),
  FOREIGN KEY (user_id) REFERENCES AccountOwner (user_id),
  Check (acc_type in ("SAVINGS", "CURRENT"))
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
  `acc_id` INT(32) not NULL,
  `acc_plan_id` int(4) not NULL,
  `acc_balance` Numeric(20,2),
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (acc_id) REFERENCES Account (acc_id),
  FOREIGN KEY (acc_plan_id) REFERENCES SavingAccoutPlan (acc_plan_id)
);

CREATE TABLE `CurrentDeposit` (
  `acc_id` INT(32) not NULL,
  `remaining_balance` Numeric(20,2),
  PRIMARY KEY (`acc_id`),
  FOREIGN KEY (acc_id) REFERENCES Account (acc_id)
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
  `state` BIT(2),
  PRIMARY KEY (`fd_id`),
  FOREIGN KEY (cusotmer_id) REFERENCES AccountOwner (user_id),
  FOREIGN KEY (acc_plan_id) REFERENCES  FDAccountPlan (fd_plan_id),
  FOREIGN KEY (sv_acc_id) REFERENCES SavingAccount (acc_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id)
);

CREATE TABLE `Loan` (
  `loan_id` INT(32) not NULL AUTO_INCREMENT,
  `loan_type` varchar(20) not NULL,
  `customer_id` int(16) not NULL,
  `loaned_amount` Numeric(20,2) not NULL,
  `loan_interrest_rate` Numeric(4,2),
  `aggreed_num_installements` int(4) not NULL,
  `finished_num_installements` int(4) not NULL,
  `deleted` BIT(2),
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (customer_id) REFERENCES AccountOwner (user_id),
  Check (loan_type in ("PERSONAL", "BUSINESS"))
);

CREATE TABLE `StandardLoan` (
  `loan_id` int(32) not NULL,
  `branch_id` int(5) not NULL,
  `accepted_date` Date,
  `state` varchar(20) not NULL,
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (loan_id) REFERENCES Loan (loan_id),
  FOREIGN KEY (branch_id) REFERENCES Branch (branch_id),
  Check (state in ("PENDING", "PAID", "NOT-PAID", "COMPLETE"))
);

CREATE TABLE `OnlineLoan` (
  `loan_id` int(32) not NULL,
  `created_date` Date,
  `fd_acc_id` int(32) not NULL,
  `state` varchar(20) not NULL,
  PRIMARY KEY (`loan_id`),
  FOREIGN KEY (loan_id) REFERENCES Loan (loan_id),
  FOREIGN KEY (fd_acc_id) REFERENCES FixedDeposit (fd_id),
  Check (state in ("PAID", "NOT-PAID", "COMPLETE"))
);

CREATE TABLE `Transaction` (
  `trans_id` int(64) not NULL AUTO_INCREMENT,
  `trans_type` char(1) not NULL,
  `amount` Numeric(10,2) not NULL,
  `date` timestamp,
  PRIMARY KEY (`trans_id`),
  Check (trans_type in ("T", "W", "D", "L"))
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
  `deposit_type` varchar(20) not NULL,
  `acc_id` int(32) ,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES Transaction (trans_id),
  FOREIGN KEY (acc_id) REFERENCES SavingAccount (acc_id),
  Check (deposit_type in ("MONEY", "CHEQUE", "TRANSFER"))
);

CREATE TABLE `ChequeDeposit` (
  `trans_id` int(48) not NULL,
  `cheque_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES Employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES Deposit (trans_id),
  FOREIGN KEY (cheque_id) REFERENCES Cheque (cheque_id)
);

CREATE TABLE `MoneyDeposit` (
  `trans_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES Employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES Deposit (trans_id)
);

CREATE TABLE `Withdraw` (
  `trans_id` int(48) not NULL,
  `acc_id` int(32) not NULL,
  `withdrawl_type` BIT(2) not NULL,
  `withdrawer_id` INT(11) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES Transaction (trans_id),
  FOREIGN KEY (acc_id) REFERENCES Account (acc_id),
  FOREIGN KEY (withdrawer_id) REFERENCES AccountOwner (user_id)
);

CREATE TABLE `MoneyWithdraw` (
  `trans_id` int(48) not NULL,
  `emp_id` int(16),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (emp_id) REFERENCES Employee (user_id),
  FOREIGN KEY (trans_id) REFERENCES Withdraw (trans_id)
);

CREATE TABLE `ATMWithdraw` (
  `trans_id` int(48) not NULL,
  `atm_point` int(4) not NULL,
  FOREIGN KEY (trans_id) REFERENCES Withdraw (trans_id)
);

CREATE TABLE `Transfer` (
  `trans_id` int(48) not NULL,
  `from_acc_id` int(32) not NULL,
  `to_acc_id` int(32) not NULL,
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES Transaction (trans_id),
  FOREIGN KEY (from_acc_id) REFERENCES SavingAccount (acc_id),
  FOREIGN KEY (to_acc_id) REFERENCES SavingAccount (acc_id)
);

CREATE TABLE `LoanPayment` (
  `trans_id` int(64),
  `loan_id` int(32),
  PRIMARY KEY (`trans_id`),
  FOREIGN KEY (trans_id) REFERENCES Transaction (trans_id),
  FOREIGN KEY (loan_id) REFERENCES Loan (loan_id)
);



