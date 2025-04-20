import Message from '../models/message.js';

// CREATE a new message
export const createMessage = async (req, res) => {
    try {
        const {content} = req.body;
        const msg = await Message.create({content});
        return res.status(201).json(msg);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

// READ all messages
export const getAllMessages = async (_req, res) => {
    try {
        const list = await Message.findAll();
        return res.json(list);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

// READ single by ID
export const getMessageById = async (req, res) => {
    try {
        const {id} = req.params;
        const msg = await Message.findByPk(id);
        if (!msg) return res.status(404).json({error: 'Not found'});
        return res.json(msg);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

// UPDATE message
export const updateMessage = async (req, res) => {
    try {
        const {id} = req.params;
        const {content} = req.body;
        const msg = await Message.findByPk(id);
        if (!msg) return res.status(404).json({error: 'Not found'});
        msg.content = content;
        await msg.save();
        return res.json(msg);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

// DELETE message
export const deleteMessage = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await Message.destroy({where: {id}});
        if (!deleted) return res.status(404).json({error: 'Not found'});
        return res.json({message: 'Deleted'});
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};
