const expect = require('expect');
const request = require('supertest');
const {	ObjectID } = require('mongodb');

const {	app } = require('./../server');
const {	Todo } = require('./../models/todo');

const todos = [{
	text: 'First test todo',
	_id: new ObjectID()
}, {
	text: 'Second test todo',
	_id: new ObjectID()
}];

beforeEach(done => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos).then(() => done());
	});
})

describe('POST /todos', () => {
	it("should create new todo", (done) => {
		const text = "Some text";
		request(app)
			.post('/todos')
			.send({
				text
			})
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({
					text
				}).then(todos => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch(err => done(err));
			})
	})

	it('should not create todo with empty body', done => {
		request(app)
			.post('/todos')
			.expect(400)
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find().then(todos => {
					expect(todos.length).toBe(todos.length);
					done();
				}).catch(e => done(e));

			})
	})
});

describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect(res => {
				expect(res.body.todos.length).toBe(todos.length);
			})
			.end(done);
	})
})

describe('GET /todos/:id', () => {
	it('should return todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return 404 if the doc is not found', (done) => {
		request(app)
			.get(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.expect(res => {
				expect(res.body.todo).toBe(undefined);
			})
			.end(done);
	})

	it('should return 400 when the id is not valid', done => {
		request(app)
			.get(`/todos/123`)
			.expect(400)
			.expect(res => {
				expect(res.body.todo).toBe(undefined);
			})
			.end(done);
	})
})

describe('DELETE /todos/:id', () => {
	it('should remove a todo', done => {
		const hexId = todos[0]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect(res => {
				expect(res.body.todo.text).toBe(todos[0].text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}
				Todo.findById(hexId).then(todo => {
					expect(todo).toBe(null);
					done();
				}).catch(e => done(e))
			})
	})

	it('should return 404 if the doc doesn\'t exist', done => {
		request(app)
			.delete(`/todos/${new ObjectID().toHexString()}`)
			.expect(404)
			.expect(res => expect(res.body.todo).toBe(undefined))
			.end(done);
	})

	it('should return 400 when the id is not valid', done => {
		request(app)
			.delete(`/todos/123`)
			.expect(400)
			.expect(res => {
				expect(res.body.todo).toBe(undefined);
			})
			.end(done);
	})
})

describe('PATCH /todos/:id', () => {
	it('should update the todo', done => {
		const hexId = todos[1]._id.toHexString();
		const newText = 'Some new text for todo';
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				text: newText,
				completed: true
			})
			.expect(200)
			.expect(res => {
				const {todo} = res.body;
				expect(todo.text).toBe(newText);
				expect(todo.completed).toBe(true);
				expect(typeof todo.completedAt).toBe('number');
			})
			.end(done);
	});

	it('should clear completedAt when completed is false', done => {
		const hexId = todos[1]._id.toHexString();
		request(app)
			.patch(`/todos/${hexId}`)
			.send({
				completed: false
			})
			.expect(200)
			.expect(res => {
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completedAt).toBe(null);
			})
			.end(done);
	});
})
