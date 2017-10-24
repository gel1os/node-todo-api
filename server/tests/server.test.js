const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

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
			.send({text})
			.expect(200)
			.expect(res => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if (err) {
					return done(err);
				}

				Todo.find({text}).then(todos => {
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