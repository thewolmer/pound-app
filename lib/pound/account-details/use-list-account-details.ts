import { useQuery } from '@tanstack/react-query';

import { AccountDetailsFilters } from '~/api/account-details/account-details.types';
import { queries } from '~/lib/pound/queries';

interface Props {
	enabled?: boolean;
}

const defaultProps = {
	enabled: true,
};

export const useListAccountDetails = (filters: AccountDetailsFilters, props: Props = defaultProps) => {
	return useQuery({ ...queries.accountDetails.list(filters), enabled: props.enabled });
};
