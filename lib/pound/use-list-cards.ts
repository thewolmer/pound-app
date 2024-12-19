import { useQuery } from '@tanstack/react-query';

import { queries } from './queries';

interface Props {
	enabled?: boolean;
}

const defaultProps = {
	enabled: true,
};

export const useListCards = (props: Props = defaultProps) => {
	return useQuery({ ...queries.cards.list, enabled: props.enabled });
};
