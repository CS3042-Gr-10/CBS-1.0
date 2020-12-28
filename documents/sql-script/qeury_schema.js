function executeTransaction(queries) {
    try {
      const connection = yield getConnectionObj(/* your db params to get connection */)
  
      let results = []

      return new Promise(function(resolve, reject) {
        connection.beginTransaction(function(err) {
            if (err) { throw err; }
            connection.query('YOUR QUERY', "PLACE HOLDER VALUES", function(err, result) {
              if (err) { 
                connection.rollback(function() {
                  throw err;
                });
              }
           
              const log = result.insertId;
           
              connection.query('ANOTHER QUERY PART OF TRANSACTION', log, function(err, result) {
                if (err) { 
                  connection.rollback(function() {
                    throw err;
                  });
                }  
                connection.commit(function(err) {
                  if (err) { 
                    connection.rollback(function() {
                      throw err;
                    });
                  }
                  console.log('Transaction Completed Successfully.');
                  connection.end();
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