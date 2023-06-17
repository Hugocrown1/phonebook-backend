require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())

app.use(express.json())

const morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body)})


app.use(morgan(':method :url :status :res[content-length]  - :response-time ms :body' ))


// let persons = [
//     {
//         "name": "Arto Hellas",
//         "number": "040-123456",
//         "id": 1
//       },
//       {
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523",
//         "id": 2
//       },
//       {
//         "name": "Tito Titorras",
//         "number": "565876234523",
//         "id": 3
//       },
//       {
//         "name": "Hugo Corona",
//         "number": "646187812431",
//         "id": 4
//       }
// ]

app.get('/', (request, response) => {
  response.send('<h1>Hello Amigos!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(p => p.id))
//     : 0

//     return maxId + 1
// }

// const personExists = (personName) =>{
//   return persons.some(person => person.name === personName)
// }

app.post('/api/persons', (request, response) => {
  const body = request.body
  
   if(!body.name || !body.number){
    return response.status(400).json({
      error: 'content missing'
    })
   }

  //  if(personExists(body.name)){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  //  }

   const person = new Person({
    name: body.name,
    number: body.number,
    
  })

  person.save().then(result => {
  
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    
  })

  response.json(person)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
    let totalPeople = persons.length
    let date = new Date()
    response.send(`<h2>Phonebook has info for ${totalPeople} people <h2><br/><h2>${date}<h2>`)
    
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log(error.name);
  

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})