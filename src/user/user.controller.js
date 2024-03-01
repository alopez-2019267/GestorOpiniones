'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const userDefault = async(req,res) =>{
    try{
        const userExists = await User.findOne({username: 'admin'})
        if(userExists){
            console.log('Ya existe el Admin Maestro')
        }else{
            const encryptPassword =  await encrypt('admin123')
            const nuevoUsuario = new User({
                name: 'admin',
                surname: 'admin',
                username: 'admin',
                password: encryptPassword,
                email: 'admin@gmail.com',
                phone: '12345678',
                role: 'CLIENTE'
            })
            await nuevoUsuario.save()
        }
    }catch(err){
        console.error(err)
    }
}

export const registerUser = async(req, res)=>{
    try{
        //Captura el formulario (body)
        let data = req.body
        //Encriptamos contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto (CLIENT)
        data.role = 'CLIENTE'
        //Guardar la información en la db
        let user = new User(data)
        await user.save()
        //Responde al usuario
        return res.send({message: `Register seccessfully, can be logged with email use ${user.username}`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err: err})
    }
}

export const login = async(req, res) =>{
    try{
        //Capturamos los datos (body)
        let {account, password} = req.body
        //validamos que el usuario exista
        let user = await User.findOne({
            $or: [
                { username : account },
                { email: account }
            ]
        })//Busca un solo registro
        //verifica que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            //Generate token 
            let token = await generateJwt(loggedUser)
            //responder al usuario
            return res.send(
                {message: `Welcome ${loggedUser.name}`,
                loggedUser,
                token})
        }
        return res.status(400).send({message: `User not found`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error to login'})
    }
}

export const updateUser = async(req, res) => {//Sirve para datos generales, menos contraseña
    try{
        //Obtener el id del usuario para actualizar
        let { id } = req.params
        //obtener los datos a actualizar
        let data = req.body
        //validar que data no este vacío
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: `Have submitted some data that cannot be updated`})
        //Validar si tiene permisos (tokenización) X hoy no lo vemos X
        //Actualizar la db
        let updatedUser = await User.findOneAndUpdate(
            //va a buscar un solo registro
            {_id: id},  //ObjectId <- hexadecimales(hora sys, version mongo, llave privada...)
            data, //los datos que se van a actualizar 
            {new: true}
        )
        //Validar la actualización
        if(!updatedUser) return res.status(401).send({message: 'User not found and not update'})
        //Responde al usuario
        return res.send({message: `Update user`, updatedUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username)return res.status(400).send({message: `Username ${err.keyValue.username} is alredy exists`})
        return res.status(500).send({message: `Error updating account`})
    }
}

export const updateUserPass = async (req, res) => {
    try {
        const { id } = req.params;
 
        const { oldPassword, newPassword } = req.body;
        // Verificar si se proporciona la contraseña antigua y la nueva contraseña
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Se requieren la contraseña antigua y la nueva contraseña' });
        }
 
        // Buscar al usuario por ID y contraseña antigua
        const user = await User.findOne({ _id: id});
 
        if (!user) {
            return res.status(401).json({ message: 'La contraseña antigua es incorrecta o el usuario no fue encontrado' });
        }
 
        // Verificar que la nueva contraseña cumpla con los requisitos mínimos
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 8 caracteres' });
        }
        let nuevacontra = await encrypt(newPassword)
        // Actualizar la contraseña del usuario
        const updatedUser = await User.findByIdAndUpdate(id, { password: nuevacontra }, { new: true });
 
        if (!updatedUser) {
            return res.status(500).json({ message: 'Error al actualizar la contraseña del usuario' });
        }
 
        return res.json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};