'user strict'

import Publication from '../publication/publication.model.js'
import User from '../user/user.model.js'
import Comment from "./comment.model.js"

import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'

export const test = (req, res) =>{
    console.log('test is running')
    res.send({message: 'Test is running'})
}

export const createComment = async (req, res) => {
    try {
        //Capturar la data
        let data = req.body
        //Validar que el user exista
        let user = await User.findOne({_id: data.user})
        if(!user) return res.status(404).send({message: 'user not found'})
        //Crear la instancia 
        let comment = new Comment(data)
        //Guardar 
        await comment.save()
        //Responder si todo sale bien
        return res.send({message: 'Comment saved successfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Error saving Comment'})
    }
}

export const updateComment = async (req, res) => {
    try {
        const data = req.body;
        const { id } = req.params;
        const { userId } = data; 

        if (!userId) {
            return res.status(400).send({ message: 'User ID is required to update the comment' });
        }

        // Verificar que el usuario del comentario coincida con el ID proporcionado
        const comment = await Comment.findOne({ _id: id });

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        if (comment.user.toString() !== userId) {
            return res.status(403).send({ message: 'You are not authorized to update this comment' });
        }

        // Realizar la actualización
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );

        // Validar la actualización
        if (!updatedComment) {
            return res.status(404).send({ message: 'Comment not found and not updated' });
        }

        // Responder si todo sale bien
        return res.send({ message: 'Comment updated successfully', updatedComment });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating comment' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        // Capturar el id del comentario a eliminar
        const { id } = req.params;
        const { userId } = req.body; 

        // Eliminar el comentario
        const deletedComment = await Comment.deleteOne({ _id: id });

        // Validar que se eliminó correctamente
        if (deletedComment.deletedCount === 0) {
            return res.status(404).send({ message: 'Comment not found and not deleted' });
        }

        // Responder
        return res.send({ message: 'Deleted comment successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting comment' });
    }
};
