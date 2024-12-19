import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { accountDetails } from './account-details';
import { cards } from './cards';
import { contacts } from './contacts';

export const queries = mergeQueryKeys(accountDetails, cards, contacts);
