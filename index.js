const express = require('express');

const app = express();
const cors = require('cors');
const morgan = require('morgan');
const Person = require('./models/person');

app.use(express.static('build'));

app.use(cors());

app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length]  - :response-time ms :body'));

app.get('/', (request, response) => {
  response.send('<h1>Hello Amigos!</h1>');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
  const { body } = request;

  const person = new Person({
    name: body.name,
    number: body.number,

  });

  person.save().then((savedPerson) => {
    console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`);
    return savedPerson.toJSON();
  }).then((savedAndFormattedPerson) => {
    response.json(savedAndFormattedPerson);
  })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { body } = request;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    const totalPeople = people.length;
    const date = new Date();
    response.send(`<h2>Phonebook has info for ${totalPeople} people <h2><br/><h2>${date}<h2>`);
  });
});

// eslint-disable-next-line consistent-return
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
