import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { cards } from './cards';

export const queries = mergeQueryKeys(cards);
