const mongoose = require('mongoose')

if (process.argv.legth<3) {
    console.log('you need to provide pasword as an argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://iisala:${password}@cluster0.du81o.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    const person = new Person({
        name : process.argv[3],
        number : process.argv[4]
    })
    person.save().then(result => {
        console.log(`added ${process.argv[3]}, number ${process.argv[4]} to the phonebook`)
        
        mongoose.connection.close()
    })
}
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(person => {
            console.log(`${person.name}: ${person.number}`)
        })
        mongoose.connection.close()
    })
}