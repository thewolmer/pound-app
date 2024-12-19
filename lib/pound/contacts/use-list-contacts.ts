import { useQuery } from '@tanstack/react-query';

import { queries } from '~/lib/pound/queries';

interface Props {
	enabled?: boolean;
}

const defaultProps = {
	enabled: true,
};

export const useListContacts = (props: Props = defaultProps) => {
	return useQuery({ ...queries.contacts.list, enabled: props.enabled });
};
