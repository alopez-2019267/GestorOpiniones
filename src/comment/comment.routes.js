import express from 'express'
import { validateJwt, isClient } from '../middlewares/validate.jwt.js'
import { test, createComment, updateComment, deleteComment } from './comment.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/createComment', createComment)
api.put('/updateComment/:id', updateComment)
api.delete('/deleteComment/:id', deleteComment)

export default api