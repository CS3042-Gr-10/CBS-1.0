
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

call add_customer('Devin', '551230c', 'devindesilva123@gmail.com', 'Devin', 'De Silva', 'Devin De Silva','2021-01-30',  '982930110v', 'male', '124/2', 'Salgas Mawatha', 'Kottawa', 10320, 0713452365, 0775673546, "CUSTOMER");

call add_saving_account(1, 200.0, 6, 2);

call add_current_account(1, 12100.0, 17);

call deposit_mn_sv_acc(200, 4, 12);

select trans_id, trans_type, acc_id, deposit_type, amount, date from (select trans_id, deposit_type, acc_id from Deposit where acc_id in (select acc_id from Account where user = 6)) as P natural join (select * from Transaction where is_deleted = 0) as Q;

select trans_id, trans_type, acc_id, withdraw_type, amount, date from (select trans_id, withdraw_type, acc_id from Withdraw where acc_id in (select acc_id from Account where user = 6)) as P natural join (select * from Transaction where is_deleted = 0) as Q

