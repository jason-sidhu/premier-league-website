import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    firstName: {
        type:String, 
        required: true, 
        min: 2, 
        max: 50
    }, 
    lastName: {
        type:String, 
        required: true, 
        min: 2, 
        max: 50
    }, 
    //check this
    email: {
        type:String, 
        required: true, 
        trim: true, 
        unique: true, 
        lowercase: true, 
        validate: {
            validator: function(v){
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
            }, 
            message: props => `${props.value} is not a valid email!`
        }
    }, 
    favouriteTeam: {
        type: String,
        required: true,
    },
    //TODO: UPDATE REQUIREMENTS ON PASSWORD
    password: {
        type: String,
        required: true
        // min: 5 
    }
}, {timestamps: true}); 

// //hash password using mongoose pre save middleware bcrypt before saving 
// userSchema.pre('save', async function(next){
//     if(this.isModified('password') || this.isNew) {
//         try { 
//             const salt = await bcrypt.genSalt(10); 
//             this.password = await bcrypt.hash(this.password, salt); 
//             next(); 
//         } catch (error) {
//             next(error); 
//         }
//     } else {
//         next(); 
//     }
// }); 

//compare password with hashed password 
userSchema.methods.comparedPassword = async function(password) {
    return bcrypt.compare(password, this.password); 
}; 

const User = mongoose.model('User', userSchema); 

export default User; 