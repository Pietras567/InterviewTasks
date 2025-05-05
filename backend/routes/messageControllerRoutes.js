import express from 'express';
import * as ctrl from '../controllers/messageController.js';

const router = express.Router();

// routes
router.post('/', ctrl.createMessage);
router.get('/', ctrl.getAllMessages);
router.get('/:id', ctrl.getMessageById);
router.put('/:id', ctrl.updateMessage);
router.delete('/:id', ctrl.deleteMessage);

export default router;
