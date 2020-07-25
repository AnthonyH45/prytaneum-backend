import { Collection } from 'mongodb';

import { connectToMongo } from './mongo';
import initAccounts, { AccountDoc } from './accounts';

/**
 * re-export anything from the collection files
 */
export { close, mongoRetry } from './mongo';
export { AccountDoc, ClientSafeAccDoc, whitelist } from './accounts';

/**
 * declare collections here, they won't be undefined before being called
 * guaranteed by calling connect on startup before we ever use any collections
 */
let Accounts: Collection<AccountDoc>;

/**
 * connects to mongo and initializes collections
 */
export async function connect(): Promise<void> {
    await connectToMongo();
    // also need to declare collections
    Accounts = initAccounts();
}

export default {
    Accounts: (): Collection<AccountDoc> => Accounts,
};
