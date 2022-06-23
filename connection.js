const mysql = require("mysql2");
const con = mysql.createConnection({
              
      host: "0.0.0.0",
      user: "root",
      password: "",
      port:'3306',
      database:"testing"
    });
    con.connect(function(err,connect) {
        if (err) throw err;
        else if(connect){
          console.log("Connected!");
      
        }
        else{
          console.log("something wrong");
        }
       //con.query("CREATE DATABASE newdata", function (err, result) {
         // if (err) throw err;
        //  console.log("Database created");
      
       // });
      });
      