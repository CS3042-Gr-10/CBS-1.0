function executeTransaction(queries) {
    try {  
      let results = []

      return new Promise(function(resolve, reject) {
        db.beginTransaction(function(err) {
            if (err) { throw err; }
            db.query('YOUR QUERY', "PLACE HOLDER VALUES", function(err, result) {
              if (err) { 
                db.rollback(function() {
                  throw err;
                });
              }
           
              const log = result.insertId;
           
              db.query('ANOTHER QUERY PART OF TRANSACTION', log, function(err, result) {
                if (err) { 
                  db.rollback(function() {
                    throw err;
                  });
                }  
                db.commit(function(err) {
                  if (err) { 
                    db.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('Transaction Completed Successfully.');
                  db.end();
                });
              });
            });
          });
     /* End Transaction */
        });
      
    
    } catch (error) {
      return Promise.reject(error)
    }
}