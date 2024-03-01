import express from 'express'
import { validateJwt, isClient } from '../middlewares/validate.jwt.js'
import { test, createPublication, updatePublication, deletePublication } from './publication.controller.js'

const api = express.Router()

api.get('/test', test)
api.post('/createPublication',[validateJwt, isClient], createPublication)
api.put('/updatePublication/:id',[validateJwt, isClient], updatePublication)//[validateJwt, isClient],
api.delete('/deletePublication/:id', [validateJwt, isClient], deletePublication)

export default api