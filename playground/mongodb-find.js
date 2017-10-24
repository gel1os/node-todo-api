const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		console.log('Unable to connect to mongodb server');
		return;
	} 
	console.log('Connected to MongoDB server');

	db.collection("Todos").find({completed: false}).toArray()
		.then(
			docs => console.log(JSON.stringify(docs)), 
			err => console.log("Unable to fetch todos", err)
		);

//	db.close();
});