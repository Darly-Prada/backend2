import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const collection = 'Users2';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: [true, 'email es obligatorio'],
        lowercase: true,
        trim: true
    },
    age: Number,
    password: String,
    loggedBy: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito',  
        default: null  
    }
});
// Middleware para cifrar la contraseña antes de guardarla
schema.pre('save', async function(next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});
const userModel = mongoose.model(collection, schema);
export default userModel;