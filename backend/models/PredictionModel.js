// models/PredictionModel.js
import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    matchId: { type: String, required: true }, // Unique identifier for the match
    gameWeek: { type: Number, required: true },
    team1Score: { type: Number, required: true },
    team2Score: { type: Number, required: true },
    matchResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'MatchResult' }, // Reference to the MatchResult model
    scored: { type: Boolean, default: false }, // To track if the prediction has been scored
    createdAt: { type: Date, default: Date.now }
});

const PredictionModel = mongoose.model('Prediction', predictionSchema);
export default PredictionModel;
