const DBDao = require('./dao/db-dao');

dbdao = new DBDao();
// dbdao.putItem();
dbdao.getItem();








// dbdao.createTable('Users',
//     [
//         {
//             AttributeName: "Email",
//             AttributeType: "S"
//         }
//     ],
//     [
//         {
//             AttributeName: "Email",
//             KeyType: "HASH"
//         }
//     ],
//     {
//         ReadCapacityUnits: 1,
//         WriteCapacityUnits: 1
//     }
// )
//     .then(res => console.log(res))
//     .catch(err => console.log(err));

