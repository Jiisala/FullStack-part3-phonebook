const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
morgan.token('logger', (req, res) => {
    return JSON.stringify(req.body)
})
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms :logger")
)
app.use(cors())
app.use(express.static('build'))

let persons = [

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
]


app.get('/', (req, res) => {
    res.send('<h1> This in the Root</h1>')
})
app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date().toString()}</p>`)
})
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    person ?
        res.json(person)
        : res.status(404).end()

})
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})
app.post('/api/persons', (req, res) => {
    const body = req.body
    if (!body.name) {
        return res.status(400).json({
            error: 'Name missing'
        })
    }
    if (!body.number) {
        return res.status(400).json({
            error: 'Number missing'
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'Name already in phonebook'
        })
    }
    const person = {
        id: Math.floor(Math.random() * 100000),
        name: req.body.name,
        number: req.body.number
    }

    persons = persons.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
