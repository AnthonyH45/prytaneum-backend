import { ObjectId, Collection } from 'mongodb';
import { getCollection } from './mongo';

export interface AccountDoc {
    [index: string]: unknown;
    _id?: ObjectId;
    email: string;
    password: string;
}
type Whitelist = '_id' | 'email';
export const whitelist: string[] = ['_id', 'email'];
export type ClientSafeAccDoc = Pick<AccountDoc, Whitelist>;

export default (): Collection<AccountDoc> => getCollection<AccountDoc>('accounts');
