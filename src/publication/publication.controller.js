'use strict'

import User from '../user/user.model.js'
import Publication from './publication.model.js'
import { encrypt, checkPassword, checkUpdate} from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res) =>{
    console.log('test is running')
    return res.send({message: 'Test is running'})
}

export const createPublication = async (req, res) => {
    try {
        let data = req.body
        let user = await User.findOne({_id: data.user})
        if(!user) return res.status(404).send({message: 'user not found'})
        //Crear la instancia 
        let publication = new Publication(data)
        //Guardar 
        await publication.save()
        //Responder si todo sale bien
        return res.send({message: 'Publication saved successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving publication'})
    }
}

export const updatePublication = async(req, res)=>{
    try {
        let data = req.body
        let {id} = req.params
        let updatedPublication = await Publication.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        ).populate('user', ['name', 'username'])//Elimianr la informacion sensible
        //Validar la actualizacion
        if(!updatedPublication) return res.status(404).send({message: 'Publication not found and not updated'})
        
        //Responder si todo sale bien
        return res.send({message: 'Publication updated successfully', updatedPublication})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error updating publication'})
    }
}

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body; // Suponiendo que el ID del usuario se envía en el cuerpo de la solicitud

        // Buscar la publicación por su ID
        const publication = await Publication.findOne({ _id: id });

        if (!publication) {
            return res.status(404).send({ message: 'Publication not found' });
        }

        // Verificar si el usuario tiene permiso para eliminar la publicación
        if (publication.user.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to delete this publication' });
        }

        // Eliminar la publicación
        const deletedPublication = await Publication.deleteOne({ _id: id });

        // Validar que se eliminó correctamente
        if (deletedPublication.deletedCount === 0) {
            return res.status(404).send({ message: 'Publication not found and not deleted' });
        }

        // Responder
        return res.send({ message: 'Deleted publication successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting publication' });
    }
};