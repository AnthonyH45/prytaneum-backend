import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import { ObjectID } from 'mongodb';

import Accounts from 'lib/accounts';
import Collections from 'db';
import env from 'config/env';

passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email' },
        (email: string, password: string, done) => {
            async function verify(): Promise<void> {
                try {
                    const user = await Collections.Accounts().findOne({
                        email,
                    });
                    if (!user) {
                        // user does not exist
                        done(null, false);
                    } else {
                        const isVerified = await Accounts.verifyPassword(
                            password,
                            user.password
                        );

                        // password does not match
                        if (!isVerified) {
                            done(null, false);
                        }

                        // password matches and we're good to go
                        done(null, user);
                    }
                } catch (e) {
                    // some error happened somewhere
                    done(e);
                }
            }

            // eslint-disable-next-line no-void
            void verify();
        }
    )
);

type Cookies = Record<string, string | undefined>;
passport.use(
    'jwt',
    new JWTStrategy(
        {
            secretOrKey: env.JWT_SECRET,
            jwtFromRequest: (req) => {
                const token = (req?.signedCookies as Cookies)?.jwt;
                return token || null;
            },
        },
        ({ _id }: { _id: string }, done) => {
            async function verify() {
                try {
                    const user = await Collections.Accounts().findOne({
                        _id: new ObjectID(_id),
                    });
                    if (!user) {
                        done(null, false);
                    } else {
                        done(null, user);
                    }
                } catch (e) {
                    done(e);
                }
            }

            // eslint-disable-next-line no-void
            void verify();
        }
    )
);
