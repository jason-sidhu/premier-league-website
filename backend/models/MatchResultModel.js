import mongoose from 'mongoose';

const matchResultSchema = new mongoose.Schema({
    matchId: { type: String, required: true, unique: true }, // Unique identifier for the match
    gameWeek: { type: Number, required: true },
    team1Score: { type: Number, required: true }, // Actual score for team 1
    team2Score: { type: Number, required: true }, // Actual score for team 2
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const MatchResult = mongoose.model('MatchResult', matchResultSchema);
export default MatchResult;
