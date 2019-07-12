const AWS = require('aws-sdk');

class DBDao {

    constructor(mydynamodb) {
        if (mydynamodb === undefined) {
            mydynamodb = new AWS.DynamoDB({
                endpoint: `http://localhost:8000`,
                region: `us-east-1`
            });
        }
        this.dynamodb = mydynamodb;
    }

    deleteTable(table) {

        return new Promise((resolve, reject) => {

            const params = {
                TableName: table
            };
            this.dynamodb.deleteTable(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });

        });
    }

    createTable(TableName, AttributeDefinitions, KeySchema, ProvisionedThroughput) {

        return new Promise((resolve, reject) => {

            const params = {
                TableName,
                AttributeDefinitions,
                KeySchema,
                ProvisionedThroughput
            };
            this.dynamodb.createTable(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });

        });

    }

    putItem(params) {

        return new Promise((resolve, reject)  => {

            this.dynamodb.putItem(params, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
            

        });

        // var params = {
        //     Item: {
        //      "Email": {
        //        S: "scheifs@gmail.com"
        //       }, 
        //      "Password": {
        //        S: "abc123"
        //       }    
        //     }, 
        //     ReturnConsumedCapacity: "TOTAL", 
        //     TableName: "Users"
        //    };
          


    }

    getItem() {


        var params = {
            Key: {
             "Email": {
               S: "scheifs@gmail.com"
              }
            }, 
            TableName: "Users"
           };
           this.dynamodb.getItem(params, function(err, data) {
             if (err) console.log(err, err.stack); // an error occurred
             else     console.log(data); 
           });
        
    }
}

module.exports = DBDao;