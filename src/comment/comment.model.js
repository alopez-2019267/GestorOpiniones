import { Schema, model } from "mongoose"

const commentSchema = Schema({
    text: {
        type: String,
        required: true
    },
    publication: {
        type: Schema.ObjectId,
        ref: "publication",
        required: true
    },
    user: {
        type: Schema.ObjectId,
        ref: "user",
        required: true
    }
})

export default model('comment', commentSchema)