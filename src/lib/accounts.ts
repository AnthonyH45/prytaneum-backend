import { InsertOneWriteOpResult, WithId } from 'mongodb';
import bcrypt from 'bcrypt';

import Collections, { AccountDoc, ClientSafeAccDoc, whitelist } from 'db';

const SALT_ROUNDS = 10;

/**
 * @description register the user in the database ONLY
 * @arg {string} username
 * @arg {string} password
 * @arg {string} confirmPass
 * @arg {object} [additionalFields] optional argument with additional fields to register the user with
 * @returns {Promise} userDoc with db _id field
 * @throws {ClientError} Username or email already exists, Passwords do not match
 */
const register = async (
    email: string,
    password: string,
    confirmPass: string
): Promise<InsertOneWriteOpResult<WithId<AccountDoc>>> => {
    if (password !== confirmPass) throw new Error('Passwords do not match');
    const match = await Collections.Accounts().findOne({ email });
    if (match !== null) throw new Error('E-mail already exists.');

    const encryptedPw = await bcrypt.hash(password, SALT_ROUNDS);
    return Collections.Accounts().insertOne({
        email,
        password: encryptedPw,
    });
};

/**
 * @description filters the sensitive data using whitelist methodology
 * @arg userDoc target to filter
 * @returns resolves to the userDoc with ONLY whitelisted fields
 */
const filterSensitiveData = (
    userDoc: AccountDoc
): Partial<ClientSafeAccDoc> => {
    if (!userDoc) return {};

    function reducer(
        accum: Partial<ClientSafeAccDoc>,
        key: keyof AccountDoc
    ): Partial<ClientSafeAccDoc> {
        if (userDoc[key] !== undefined) {
            return { ...accum, [key]: userDoc[key] };
        }
        return accum;
    }
    return whitelist.reduce<Partial<ClientSafeAccDoc>>(reducer, {});
};

export default {
    verifyPassword: bcrypt.compare,
    filterSensitiveData,
    register,
};
