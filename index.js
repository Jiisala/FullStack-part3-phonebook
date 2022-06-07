require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
const { response } = require('express')
const res = require('express/lib/response')

app.use(express.static('build'))
app.use(express.json())
morgan.token('logger', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :logger")
)
app.use(cors())

/*const unknownEndpoint = (req, res) =>{
    console.log(error.message)

    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)*/
const errorHandler = (error, req, res, next) =>{
    console.error(error.message)
    if (error.name === 'CastError'){
        return response.status(400).send({ error:'malformed id'})
    }
    next(error)
}

app.use(errorHandler)
/*let persons = [

    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"

    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    },
    {
        "id": 5,
        "name": "URPO TURPONEN",
        "number": "s2391083+21"
    }
]*/


app.get('/', (req, res) => {
    res.send('<h1> This in the Root</h1>')
})
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
    res.json(persons)
    })
})
/*app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date().toString()}</p>`)
})*/
app.get('/api/persons/:id', (req, res, next) => {
    
    Person.findById(req.params.id).then(person => {
        if (person){
        response.json(person)
        } else{
            response.status(404).end()
        }
    })    
    .catch(error => next(error))
})
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
    res.status(204).end()
    })
    .catch(error => next(error))
})
app.put('/api/persons/:id', (req, res, next) => {
    
    const body = req.body
    const person = {
        id : body.id,
        name: body.name,
        number:body.number

    }
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson =>{
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})
app.post('/api/persons', (req, res, next) => {
    
    const body = req.body
    if (body.name === '') {
        console.log('BÄM')
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    if (body.number === '') {
        console.log('BOOM')

        return res.status(400).json({
            error: 'Number missing'
        })
    }
    /*if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'Name already in phonebook'
        })
    }*/
    const person = new Person({
       // id: Math.floor(Math.random() * 100000),
        name: req.body.name,
        number: req.body.number
    })

    person.save().then(savedPerson => {
        console.log(savedPerson)
        res.json(savedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
