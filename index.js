
// Midelvare es una funcion que intercepta la peticion que esta pasando por tu API

// cors: Midelware para poder hacer peticiones fetch a otro dominio o origen, que cualquier orgen funcione en nuestra API
const cors = require('cors')

// Comand JS: Soporte para importar modulos
const express = require('express')
const app = express()
const logger = require('./loggerMidelware')

app.use(cors())
app.use(express.json())

// Usando un Midelware
app.use(logger)

let notes = [
  {
    id: 1,
    content: 'Soy Estiven de Ibague Tolima hijo de Amanda y Gentl',
    date: '09/06/2022',
    important: true
  },
  {
    id: 2,
    content: 'Soy Amanda de Manizales Caldas',
    date: '09/06/2022',
    important: false
  },
  {
    id: 3,
    content: 'Soy Gentil Mahecha de Guamo Tolima',
    date: '09/06/2022',
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello Worldes</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = Number(request.params.id)
  const noteId = notes.find(note => note.id === id)

  if (noteId) {
    response.json(noteId)
  } else {
    response.status(404).end()
  }
})

app.post('/api/notes', (request, response) => {
  const note = request.body

  if (!note || !note.content) {
    return response.status(400).json({
      error: 'note.content is missing'
    })
  }

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }
  notes = [...notes, newNote]
  response.json(newNote)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

// Con app.use cualquier peticion o path que se busque va a devolver esto
app.use((request, response) => {
  console.log(request.path)
  response.status(404).json({
    error: 'Not found'
  })
})

// Tipo de peticiones rest
// .get
// .post
// .del
// .put

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server runnin on port ${PORT}`)
})
