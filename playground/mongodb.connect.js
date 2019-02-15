const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost/27017/TodoApp', {useNewUrlParser: true}, (err, client) => {
  if(err) {
    return console.log('Unable to connect to mongodb server');
  }

  console.log('Connected to mongodb server');
  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: "Something to do",
  //   completed: false
  // }, (err, doc) => {
  //   if(err) {
  //     return console.log('Unable to insert todo', err);
  //   }
  //
  //   console.log(JSON.stringify(doc.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: "Diesel",
  //   age: 8,
  //   location: "Illinois"
  // }, (err, doc) => {
  //   if(err) {
  //     return console.log('Unable to insert user into collection', err);
  //   }
  //
  //   console.log(doc.ops[0]._id.getTimestamp());
  // });

  client.close();
});
