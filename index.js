import { faker } from "@faker-js/faker";
import { createConnection } from "mysql2";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import methodOverride from 'method-override';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (error) {
    console.log(err);
    res.send("error");
  }
});

//count users
app.get("/users", (req, res) => {
  let q = `SELECT * FROM user`;

  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("users.ejs", { users });
    });
  } catch (error) {
    console.log(err);
    res.send("error");
  }
});

//edit user
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
   try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("Edit.ejs", { user });
    });
  } catch (error) {
    console.log(err);
    res.send("error");
  }
 

})


app.patch("/user/:id", (req,res)=>{
   let {id} = req.params;
   let {password: formPassword, username: newUsername} =req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
   try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if(formPassword != user.password){
        res.send("Wrong password"); 
      }else{
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;
        connection.query(q2,(err, result)=>{
          if(err) throw err;
          res.redirect("../users");
        })
      }
     
    });
  } catch (error) {
    console.log(err);
    res.send("error");
  }
});

app.get("/user/add-user", (req, res) => {
  res.render("addUser.ejs"); // Renders the form page
});


app.post('/user/add-user', async (req, res) => {
  try {
      const { username, email, password } = req.body;
  const query = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";

  connection.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Database error");
    }

  
    res.redirect("/users");
  });
  } catch (err) {
    console.error('SQL Error:', err); 
    res.status(500).send('Database error');
  }
});



app.listen("8080", () => {
  console.log("server is listening on 8080");
});

// let p = "INSERT INTO user (id,username,email,password) VALUES ?";
// let data = [];

// for(let i =0;i <100; i++){
//  data.push(getRandomUser());
// }

// connection.query(p,[data], (err, result) => {
//   if (err) {
//     console.error("Query Error:", err);
//     return;
//   }
//   console.log(result);
// });

// connection.end();
