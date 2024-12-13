'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const defaultQueryConfig = { staleTime: 60000 };

export const APIProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: defaultQueryConfig,
				},
			})
	);
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
