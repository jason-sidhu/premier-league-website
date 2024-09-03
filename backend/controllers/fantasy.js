import axios from "axios";

export const getFantasyDataGeneral = async(req, res) =>{
    try{
        const response = await axios.get('https://fantasy.premierleague.com/api/bootstrap-static/');
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching general fantasy data', err); 
        res.status(404).json({ message: err.message }); 
    }
}

export const getFantasyFixtures = async(req, res) =>{
    try{
        const response = await axios.get('https://fantasy.premierleague.com/api/fixtures/');
        res.json(response.data); 
    } catch(err) {
        console.error("Error fetching fantasy fixture data", err);
        res.status(404).json({message: err.message}); 
    }
}

export const getFantasyPlayer = async(req, res) =>{
    
    const { playerId } = req.params; 
    try{
        const response = await axios.get(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`);
        res.json(response.data); 
    } catch (err) {
        console.error('Error fetching general fantasy player', err); 
        res.status(404).json({ message: err.message });
    }
}