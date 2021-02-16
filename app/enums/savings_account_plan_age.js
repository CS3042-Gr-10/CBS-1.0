const Savings_account_plan_age ={
  CHILDREN: 0,
  TEEN : 12,
  ADULT : 19,
  SENIOR : 60,
}

const Savings_account_plan_init = {
  CHILDREN: 0,
  TEEN : 500,
  ADULT : 1000,
  SENIOR : 1000,
}




function check_ageRange(age,plan){
    switch (plan) {
      case '1':
        if(age>=Savings_account_plan_age.CHILDREN && age<Savings_account_plan_age.TEEN ){
          return true;
        }
        return false;
        break;
      case '2':
        if(age>=Savings_account_plan_age.TEEN && age<Savings_account_plan_age.ADULT ){
          return true;
        }
        return false;
        break;
      case '3':
        // console.log(age);
        if(age>=Savings_account_plan_age.ADULT && age<Savings_account_plan_age.SENIOR ){
          return true;
        }
        return false;
        break;
      case '4':
        if(age>=Savings_account_plan_age.SENIOR ){
          return true;
        }
        return false;
        break;
    }
}

function check_initBalanceRange(age,plan){
  switch (plan) {
    case '1':
      if(age>=Savings_account_plan_age.CHILDREN && age<Savings_account_plan_age.TEEN ){
        return true;
      }
      return false;
      break;
    case '2':
      if(age>=Savings_account_plan_age.TEEN && age<Savings_account_plan_age.ADULT ){
        return true;
      }
      return false;
      break;
    case '3':
      // console.log(age);
      if(age>=Savings_account_plan_age.ADULT && age<Savings_account_plan_age.SENIOR ){
        return true;
      }
      return false;
      break;
    case '4':
      if(age>=Savings_account_plan_age.SENIOR ){
        return true;
      }
      return false;
      break;
  }
}




module.exports = { check_ageRange };