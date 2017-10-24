const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const app = express();

const port = process.env.port || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	console.log(req.body);
	const todo = new Todo({
		text: req.body.text
	});
	todo.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
})

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos});
	}, e => {
		res.status(400).send(e);
	});
})

app.get('/todos/:id', (req, res) => {
	const id = req.params.id;

	if (!ObjectID.isValid(id)) {
		res.status(400).send(`The provided id ${id} is invalid`)		
	}

	Todo.findById(id).then(todo => {
		if (!todo) {
			res.status(404).send(`No todo found`)				
		}

		res.send({todo});

	}).catch(e => res.status(400).send());

//	res.send(req.params)
})

app.listen(port, () => {
	console.log(`Started on port: ${port}`);
});

module.exports = {app};