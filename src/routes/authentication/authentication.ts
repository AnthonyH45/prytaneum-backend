import express from 'express';
import passport from 'passport';

import { AccountDoc } from 'db';
import Accounts from 'lib/accounts';
import jwt from 'lib/jwt';

const router = express.Router();

router.post(
    '/login',
    passport.authenticate('login', { session: false }),
    async (req, res, next) => {
        try {
            const { user } = req as Express.Request & { user: AccountDoc };
            const clientUser = Accounts.filterSensitiveData(user);
            const token = await jwt.sign(clientUser);
            res.cookie('Bearer', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                signed: true,
            });
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
);

router.get('/logout', (req, res, next) => {
    try {
        res.clearCookie('jwt');
        res.sendStatus(200);
    } catch (e) {
        next(e);
    }
});

export default router;
