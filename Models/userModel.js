import mongoose from 'mongoose';
const {Schema, model} =mongoose;

const userSchema= new Schema ({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: false
    }
});
const userModel = model('UserModel', userSchema);


export default userModel;