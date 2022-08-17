const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
var cors = require('cors');
app.use(cors())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, HTTP, ,HTTPS ,PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { query } = require("express");
const mysql = require("mysql2");
const res = require("express/lib/response");
const con = mysql.createConnection({
      // host: "localhost",
      // user: "workevnf_worklog",
      // password: "Em0EJOg-)XS5",
      // port:'3306',
      // database:"workevnf_worklog"
      host: "0.0.0.0",
      user: "root",
      password: "",
      port: '3306',
      database: "testing"

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
// Create server
const port = process.env.port || 8090;
app.use(express.static('./public/view/'));
app.set('views', path.join('./public/view/'))
app.set('view engine', "hbs");
//routing
app.get("/", async (req,res)=> {
    res.render("index");
});
// get data mysql db and bind html form (worklog detail)
app.post('/showdetail', function(req, res, next) {
  var username = req.body.employee_id;
  var sql =`SELECT * FROM worklog WHERE employeeName ='${username}'ORDER BY id DESC`
//   var sql =`SELECT * FROM worklog WHERE employeeName ='${username}'`
//   var sql='SELECT * FROM `worklog` ORDER BY id DESC; ';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
  // console.log(results);
});
});
app.get('/showdropdown', function(req, res, next) {
  var sql='SELECT * FROM project';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
  // console.log(results);
});
});
app.get('/projectList', function(req, res, next) {
  var sql='SELECT * FROM project';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
  // console.log(results);
});
});
app.get('/showlist', function(req, res, next) {
  var sql='SELECT count(*) as projectcount  FROM project';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
});
});
app.post('/remainder', function(req, res, next) {
  var username = req.body.employee_id;
  var sql=`SELECT time FROM worklog where employeeName='${username}'ORDER BY id DESC LIMIT 1`;
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
});
});
app.post('/sumtime', function(req, res, next) {
  var username = req.body.employee_id;
  var sql =`SELECT SUM(time) FROM worklog WHERE employeeName ='${username}'`
  // var sql='SELECT SUM(time) FROM worklog; ';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
});
});
// emp detail show mysql db
app.get('/showempdetail', function(req, res, next) {
  var sql='SELECT * FROM employee';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
  // console.log(results);
});
});
// send data login form to mysql db
app.post("/adddetail",(req,res)=>{
 if(!req.body.projectCode)
  {
    res.send("projectCode is missing.");
  }
  else {
    if(!req.body.Description)
    {
        res.send("Description name is missing.");
    }
    else {
        if(!req.body.date)
        {
            res.send("Date is missing.");
        }
        else {
            if(!req.body.time)
            {
                res.send("Time is missing.");
            }
            else 
            {
                if(!req.body.status)
                {
                    res.send("Status is missing.");
                }
                else{
  
    var name = req.body.projectCode;
    var Description = req.body.Description;
    var date = req.body.date;
    var time = req.body.time;
    var status = req.body.status;
    var employeeName = req.body.employeeName;

var d = new Date();

var month = d.getUTCMonth() + 1; //months from 1-12
var day = d.getUTCDate();
var year = d.getUTCFullYear();
let newdate = year + "/" + month + "/" + day;
    var que = `SELECT customerName FROM project WHERE projectCode = "${name}"`;
    con.query(que, function(err, result1) {
      if(err) throw err;
      if(!result1[0])
      {
          res.send("Invaild project name.");
      }
      else
      {
      var cust_name = result1[0].customerName;
    var sql = `INSERT INTO worklog (projectCode, Description, date, time,status,customerName,currentDate,employeeName) VALUES ("${name}", "${Description}", "${date}", "${time}","${status}","${cust_name}","${newdate}","${employeeName}")`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      // console.log(result.affectedRows);
      if(result.affectedRows == 1)
      {
        console.log("Done1");
          res.send('Data added successfully!');
      }
     //res.redirect('/');
    });
  }

  })
  }
            }
        }
    }
    }
})
  app.post('/projectadd/',(req,res)=>{
  
     var proj = req.body.projectName;
    var cust = req.body.customerName;
    var projectCode = req.body.projectCode;
    var customerID = req.body.customerID;

    var description = req.body.description;
    var startdate = req.body.startdate;
    var deadline = req.body.deadline;

    
    var sql = `INSERT INTO project (projectName,customerName,description,startdate,deadline,customerID,projectCode) VALUES ("${proj}", "${cust}","${description}","${startdate}","${deadline}","${customerID}","${projectCode}")`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      // console.log(result.affectedRows);
      if(result.affectedRows == 1)
      {
        console.log("Done"); 
          res.json('Data added successfully!');
      }
     //res.redirect('/');
    });

  })


  app.post('/useradd/',(req,res)=>{
    var username = req.body.employee_id;
    var password = req.body.password;
    var employeeName = req.body.employeeName;
    var employeeRoll = req.body.employeeRoll;
    var sql = `INSERT INTO employee (employee_id,password,employeeName,employeeRoll) VALUES ("${username}", "${password}","${employeeName}","${employeeRoll}")`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      if(result.affectedRows == 1)
      {
        console.log("Done");
          res.send('Data added successfully!');
      } 
    });
  })


  


  app.post('/add/',(req,res)=>{
    var customer_id  = req.body.customer_id ;
    var customerName  = req.body.customerName ;
    var username  = req.body.username ;
    var password  = req.body.password;
    var sql = `INSERT INTO customer (customer_id,customerName,username,password) VALUES ("${customer_id}", "${customerName}","${username}","${password}")`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      // console.log(result.affectedRows);
      if(result.affectedRows == 1)
      {
        console.log("Done");
          res.send('Data added successfully!');
      }
     //res.redirect('/');
  
    });
  })

//pwd : Em0EJOg-)XS5

  app.put('/passwordchange',(req,res)=>{
    var username = req.body.employee_id;
    var password = req.body.password;

    console.log(username,password)
   var sql =  `UPDATE employee set password ="${password}" WHERE employee_id = "${username}"`;
    con.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      if(result.affectedRows == 1)
      {
        console.log("Done");
          res.send('Data added successfully!');
      }
    });
  })
 
  app.post('/login', function(request, response) {
    var username = request.body.employee_id;
    var password = request.body.password;
    //console.log(username);

    if (username && password) {

        con.query('SELECT * FROM employee WHERE employee_id = ? AND password = ?', [username, password], function(error, results) {
          //  if(error)
          //  {
          //    console.error(error);
          //  }
          console.log(results.length);
           if(results.length == 0)
           {
             response.send("Username and Password is incorrect.");
           }
           else
           {
            if (results[0].employee_id == username || results[0].password == password) {
              // if(results[0].password == password)
              {
 
                 response.send("Login successfully.");
              }
               
            } else {

                    // response.send("admin")
                response.send('Incorrect Username and/or Password!');
            }     
         }      
        });
    } else {
        response.send('Please enter Username and Password!');
    }
});
  
  app.post('/filterrecord', function(request, response) {
  var employeeName = request.body.employeeName;
         console.log(employeeName)
  if (employeeName) {
      con.query('SELECT * FROM worklog WHERE employeeName = ? ', [employeeName], function(error, results) {
        console.log(results.length);
        console.log(results)
         if(results.length == 0)
         {
           response.send("Username incorrect.");
         }
         else
         {
          if (results[0].employeeName == employeeName) {
            {
              response.json({
                data : results
              })
            }
          } 
       }      
      });
  }
});


// delete new code add 
app.delete('/deleteemployee',(req,res)=>{
  var emp_ID = req.body.emp_ID;
 con.query('DELETE from employee WHERE emp_ID = ? ', [emp_ID], function(error, results) {
  console.log("Done",results);
  res.send('Data Delete successfully!');
     
  });
})

// New code add employee update
app.post('/userchange',(req,res)=>{
  var emp_Id = req.body.emp_ID;
  var employee_id = req.body.employee_id;
  var password = req.body.password;
  var employeeName = req.body.employeeName;
  var employeeRoll = req.body.employeeRoll;
  console.log(emp_Id,employee_id,password, employeeName,employeeRoll );
  var sql =  `UPDATE employee SET password ="${password}",employeeName ="${employeeName}",employeeRoll="${employeeRoll}",employee_id ="${employee_id}" WHERE emp_Id = ${emp_Id};`;
 console.log(sql);
 con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("err",err);
    if(result.affectedRows == 1)
    {
      console.log("Done",result);
        res.send('Data added successfully!');
    }
  });
})
app.post('/prjchange',(req,res)=>{
  var id = req.body.id;
  var projectCode = req.body.projectCode;
  var projectName = req.body.projectName;
  var customerName = req.body.customerName;
  var customerID = req.body.customerID;
  var description = req.body.description;
  var sql =  `UPDATE project SET projectCode ="${projectCode}",projectName ="${projectName}",customerName="${customerName}",customerID ="${customerID}",description ="${description}" WHERE id = ${id};`;
 console.log(sql);
 con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("err",err); 
     console.log("Done",result);
        res.send('Data update successfully!');
    
  });
})



app.get('/showlistproj', function(req, res, next) {

  var sql='SELECT count(*) as projectcount  FROM project';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
});
});




app.post('/leaveapi',(req,res)=>{
  var name = req.body.name;
  var date = req.body.date;
  var reason = req.body.reason;
  var employeename = req.body.employeename;
  var sql = `INSERT INTO empleave (name,date,reason,employeename) VALUES("${name}","${date}","${reason}","${employeename}")`;
  con.query(sql, function(err,result){
    if (err) throw err;
    if(result.affectedRows == 1){
      res.json("Data added successfully!")
    }
  })
})


app.get('/leavedetail', function(req, res, next) {
  var sql='SELECT * FROM empleave';
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
});
});


app.post('/showleave', function(req, res, next) {
  var employeename = req.body.employeename;
  var sql =`SELECT * FROM empleave WHERE employeename ='${employeename}'ORDER BY id DESC LIMIT 1`
  con.query(sql, function (err, results) {
  if (err) throw err;
  res.json({
    data : results
  })
  // console.log(results);
});
});


// app.post('/leaveres',(req,res)=>{
//   var response = req.body.status
//   var sql = `INSERT INTO empleave (status) VALUES ("${response}")`;
//   con.query(sql,function(err,result){
//     if(err) throw err;
//     res.json("Respond send successfully")
//   })
// })


app.post('/leaveapprove',(req,res)=>{
  var reply = req.body.reply;
  var empname = req.body.employeename;
  try{
  var sql =  `UPDATE empleave SET reply ="${reply}" WHERE employeename = "${empname}"`;
 con.query(sql, function(err, result) {
    if (err) throw err;
    if(result.affectedRows == 2)
    {   

      console.log(result) 
        res.send('Data added successfully!');
    }
  });
}catch(e){
  console.log("error",e)
}
})


// toska api

app.post("/tokenrecord",async (req,res)=>{   
//      if(!req.body.phonenumber)
//   {
//       res.json({massage:'number is missing '});
//   }
   if(!req.body.email || !req.body.phonenumber)
  {
            //   res.json({massage:'email is missing. '});
  }
  var phonenumber   = req.body.number ;
  var email       = req.body.email  ;
  var sql = `INSERT INTO toska (phonenumber, email) VALUES("${phonenumber}","${email}")`;
  con.query(sql, function(err, result) {
     if (err) throw err;
     console.log(' token record inserted');
     if(result.affectedRows == 1)
     {
       console.log("Done");
         res.json({massage:'Thank You '});
     }
   });  
 });

console.log("Server is running on 8090 :)");
app.listen(port);

console.log ("server created");
