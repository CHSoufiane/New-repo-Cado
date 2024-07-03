import Draw from '../models/Draw.js';

const drawController = {
async createDraw (req, res) {
    const { event_id, giver_id, receiver_id } = req.body;
    try {
        const draw = await Draw.create({
            event_id,
            giver_id,
            receiver_id
        });
        return res.status(201).json(draw);
    }
    
    catch (error) { 
        console.error(error.message)
        res.status(500).json({ message: 'Internal server error' });
    }
},

    async getDraws (req, res) {
        try {
            const allDraws = await Draw.findAll();
            return res.status(200).json(allDraws);
        }
        
        catch (error) { res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getOneDraw (req, res) {
        try {
            const draw = await Draw.findByPk(req.params.id);
            if (!draw) {
                return res.status(404).json({ message: 'Draw not found' });
            }
            return res.status(200).json(draw);

        } 
        
        catch (error) { res.status(404).json({ message: 'Draw not found' });
        }

    },

    async updateDraw (req, res) {
        const { id } = req.params;
        const { event_id, giver_id, receiver_id } = req.body;
        try {
            const draw = await Draw.findByPk(id);
            if (!draw) {
                return res.status(404).json({ message: 'Draw not found' });
            }

            await draw.update({
                event_id,
                giver_id,
                receiver_id
            });
            return res.status(200).json({ message: 'Draw updated', draw });
        } 
        
        catch (error) { res.status(500).json({ message: 'Internal server error' });
        }

    },

    async deleteDraw (req, res) {
        try {
            const draw = await Draw.findByPk(req.params.id);
            if (!draw) {
                return res.status(404).json({ message: 'Draw not found' });
            }
            await draw.destroy();
            return res.json({ message: ` Draw: ${draw.id} / ${draw.name} deleted` });
        }

        catch (error) { res.status(500).json({ message: 'Internal server error' });
        }

    },
};

export default drawController