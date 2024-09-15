
const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
morgan.token('body', req => {return JSON.stringify(req.body)} )
app.use(morgan('tiny'))
app.use(morgan(':method  :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
    const phonebookSize = persons.length
    const date = new Date()
    const formattedText = `<p>Phonebook has info for ${phonebookSize} people</p> <p>${date}</p>`
    response.send(formattedText)
})

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(person => person.id === request.params.id)
    if (person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(person => person.id !== request.params.id)
    response.status(204).end()
})

const getId = () => {
    const id = Math.floor(Math.random() * 100000000)
    return id

}

app.post('/api/persons', (request, response) => {
    const body = request.body


    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })

    }
    if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })

    }

    const nameExists = persons.find(person => person.name === body.name)
    if (nameExists) {
        return response.status(400).json({
            error: `${body.name} already exists in the phonebook`
        })
    }

    const newPerson = {
        id: getId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.status(201).end()

})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running...`)
})
