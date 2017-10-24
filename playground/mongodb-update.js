const MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
	if (err) {
		console.log('Unable to connect to mongodb server');
		return;
	}
	console.log('Connected to MongoDB server');

	db.collection("Todos").findOneAndUpdate({
		text: "Walk the dog",
	}, {
		$set: {
			completed: false
		}
	}, {
		returnOriginal: false
	}).then(result => {
		console.log('result:', result);
	})

	//	db.close();
});