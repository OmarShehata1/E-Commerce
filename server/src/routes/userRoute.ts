import express from 'express';
import { login, register } from '../services/userServices';

const router = express.Router();

router.post('/register',async (req, res) => {
    try {
    const { firstName, lastName, email, password } = req.body;
    const {statusCode , data} = await register({ firstName, lastName, email, password });
    res.status(statusCode).send(data);
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
});


router.post('/login', async (req, res) => {
    try {
    const { email, password } = req.body;
    const {statusCode , data} = await login({ email, password });
    res.status(statusCode).send(data);
    }
    catch (error) {
        res.status(500).send("Internal server error");
    }
});

export default router;