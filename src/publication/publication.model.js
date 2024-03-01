import { Schema, model } from "mongoose";

const publicationSchema = Schema({
    tittle: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    principalText: {
        type: String,
        require: true
    },
    user: {
        type: Schema.ObjectId, 
        lowerCase: true,
        require: true,
        ref: 'user'
    }
},
{
    versionKey: false //desahabilitar el __v (versión del docuemnto)
}
)

export default model('publication', publicationSchema)