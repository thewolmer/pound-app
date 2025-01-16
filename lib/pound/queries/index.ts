import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { accountDetails } from './account-details';
import { cards } from './cards';

export const queries = mergeQueryKeys(accountDetails, cards);
