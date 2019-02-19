const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const{Todo} = require('./../models/todo');

var todos = [{
  _id: new ObjectID(),
  text: "First test todo"
}, {
  _id: new ObjectID(),
  text: "Second test todo",
  completed: true,
  completedAt: 1276374
}];


beforeEach((done) => {
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "test todo text";
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
          }).catch((e) => done(e));
      });
  })

  it('Should not create new todo without required fields', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));

      });
  });
});

describe('GET /todos', () => {
  it('should return all the todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', (done) => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    var id = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 for invalid id', (done) => {
      request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove todo', (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Todo.findById(id).then((todo) => {
          expect(todo).not.toBeTruthy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
  });

  it('Should return 404 if ObjectID is invalid', (done) => {
      var id = new ObjectID().toHexString();
      request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('Should update the todo', (done) => {
    var id = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .send({text:'Some text', completed: true})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Some text');
        expect(res.body.todo.completed).toBeTruthy();
        expect(res.body.todo.completedAt).toBeTruthy();
      })
      .end(done);
      //   if(err) {
      //     return done(err);
      //   }
      //
      //   Todo.findById(id).then((todo) => {
      //     expect(todos.text).toBe('Some text');
      //     expect(todos.completed).toBeTruthy();
      //     expect(todo.completedAt).toBeA('number');
      //     done();
      //   }).catch((e) => done(e));
      //
      // });
  });

  it('Should clear completedAt when completed is false', (done) => {
    var id = todos[1]._id.toHexString();
    request(app)
      .patch(`/todos/${id}`)
      .send({text: 'Hello World', completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe('Hello World');
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
      //   if(err) {
      //     return done(err);
      //   }
      //
      //   Todo.findById(id).then((todo) => {
      //     expect(todo.text).toBe('Hello World');
      //     expect(todo.completed).toBe(false);
      //     expect(todo.completedAt).toBeFalsy();
      //     done();
      //   }).catch((e) => done(e));
      // })
  });
});
