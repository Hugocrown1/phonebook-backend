const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please follow the next format: node mongo.js <password> name phone')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://hugocrown:${password}@cluster0.im7lt3r.mongodb.net/phonebook?retryWrites=true&w=majority`
  

mongoose.connect(url)



const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("phonebook:");
        result.forEach(person => {
        console.log(person.name, person.phone)
        
        
        })
        mongoose.connection.close()
        
      })
  }

if(process.argv.length === 5){
const person = new Person({
  name: process.argv[3],
  phone: process.argv[4],
  
})

person.save().then(result => {
  
  console.log(`added ${result.name} number ${result.phone} to phonebook`)
  mongoose.connection.close()
})
}