
call add_emp('Devindesilva',
    '5510c',
    'devindesilva123@gmail.com',
    'Devin', 'De Silva',
    'Devin De Silva',
    '2021-01-30',
    10230,
    776685899,
    '982910110v',
    1,
    'male',
    '124/2',
    '145/5',
    'Salgas Mawatha',
    1);

call add_customer('DevinDe', '551233240c', 'devindesilva123@gmail.com', 'Devin', 'De Silva', 'Devin De Silva','2001-01-30',  '982930130v', 'male', '124/2', 'Salgas Mawatha', 'Kottawa', 10320, 0713452365, 0775673546, "CUSTOMER");

call add_org();

call add_saving_account(1, 600.0, 6, 2);

call add_current_account(1, 12100.0, 17);

call deposit_mn_sv_acc(200, 4, 2);

call withdraw_mn_sv_acc(2, 3, 10);

call transfer_mn(8, 100, 4, 2);

call add_fd_acc(6, 2, 2, 1, 10000, 1);

call add_std_loan(8,12000.0, 1.32, 100, 1);

call loan_payment(12); # didn't run

call get_loan_details(7);

call get_fd_details(2);

select trans_id, trans_type, acc_id, deposit_type, amount, date from (select trans_id, deposit_type, acc_id from Deposit where acc_id in (select acc_id from Account where user = 6)) as P natural join (select * from Transaction where is_deleted = 0) as Q;

select trans_id, trans_type, acc_id, withdraw_type, amount, date from (select trans_id, withdraw_type, acc_id from Withdraw where acc_id in (select acc_id from Account where user = 6)) as P natural join (select * from Transaction where is_deleted = 0) as Q

