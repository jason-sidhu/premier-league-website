import mongoose from 'mongoose';

const userScoreSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        index: true 
    },
    gameWeekScores: [{
        gameWeek: { 
            type: Number, 
            required: true 
        },
        score: { 
            type: Number, 
            required: true,
            default: 0 // Ensure scores are initialized to 0
        }
    }],
    totalScore: { 
        type: Number, 
        default: 0 
    }
}, {
    timestamps: true 
});


const UserScoreModel = mongoose.model('UserScore', userScoreSchema);
export default UserScoreModel;
