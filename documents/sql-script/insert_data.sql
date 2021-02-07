## User
INSERT INTO User(user_type, username, password, acc_level) values ('A','customer-001','$2a$10$.oYen/SywSkrTnR5rlz9V.w06G3D4hz2uoBQZgVhm/CoR8Idqs7xC',1);
INSERT INTO User(user_type, username, password, acc_level) values ('A','org-001','$2a$10$5vED6S5g7cgRp1Gi9nBXUeC3UC7G0L2c0QsSuy4JnVeAyaBlEi2Yq',1);
INSERT INTO User(user_type, username, password, acc_level) values ('E','emp-001','$2a$10$5qEe8hgSiZ2/lk5y4BfEAu9GwbF2GFdn7TfALz.2rNvO.XZ.LW74O',2);
--------------------------------------------------------------------------------------------------------------------------------------------------
## AccountOwner

--------------------------------------------------------------------------------------------------------------------------------------------------
## Branch
INSERT INTO Branch (branch_id, branch_name, street, city, postal_code, grade, contact_No) values (1, 'kottawa', 'main road', 'Kottawa', 12432, 1, 0776549801);
--------------------------------------------------------------------------------------------------------------------------------------------------
## Post
INSERT INTO Post(post_id, post_name, salary) values (1, "Bannk Manager", 50000.00);
INSERT INTO Post(post_id, post_name, salary) values (2, "Employee", 20000.00);

--------------------------------------------------------------------------------------------------------------------------------------------------
## Employee

--------------------------------------------------------------------------------------------------------------------------------------------------
## Organization

--------------------------------------------------------------------------------------------------------------------------------------------------
## Customer

--------------------------------------------------------------------------------------------------------------------------------------------------