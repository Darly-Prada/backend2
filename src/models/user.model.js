import mongoose from 'mongoose';

const collection = 'Users2';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required:[true, 'email es obligatorio'],
        lowercase: true, 
        trim: true // 
    },
    age: Number,
    password: String,
    loggedBy: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;