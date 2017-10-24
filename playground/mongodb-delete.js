const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		console.log('Unable to connect to mongodb server');
		return;
	} 
	console.log('Connected to MongoDB server');

	db.collection("Todos").deleteOne({
		text: "spome random text",
	}).then(result => {
		console.log('result:', result);
	})

//	db.close();
});