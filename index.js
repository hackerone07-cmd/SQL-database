import { faker } from "@faker-js/faker";

import { createConnection } from "mysql2";

const connection= createConnection({
     host:'localhost',
     user:'root',
     database: 'delta_app',
     password: '',
});


let getRandomUser = () => {
  return [
         faker.string.uuid(),
         faker.internet.username(),     
         faker.internet.email(),
         faker.internet.password(),
  ];
};



let p = "INSERT INTO user (id,username,email,password) VALUES ?";
let data = [];

for(let i =0;i <100; i++){
 data.push(getRandomUser());
}

connection.query(p,[data], (err, result) => {
  if (err) {
    console.error("Query Error:", err);
    return;
  }
  console.log(result);
});

connection.end();



