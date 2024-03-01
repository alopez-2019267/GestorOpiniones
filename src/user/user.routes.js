import express from 'express'
import { validateJwt, isClient } from '../middlewares/validate.jwt.js'
import { test, registerUser, login, updateUser, updateUserPass } from './user.controller.js'

const api = express.Router()

api.get('/test', test)// [validateJwt],
api.post('/registerUser', registerUser)
api.post('/login', login)
api.put('/updateUser/:id', [validateJwt, isClient], updateUser) 
api.put('/updateUserPass/:id', [validateJwt, isClient], updateUserPass) 

export default api