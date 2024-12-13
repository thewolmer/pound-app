import { Session } from '@supabase/supabase-js';
import axios from 'axios';

import { Env } from '~/config/env';

let authInterceptor: number | null = null;

export const poundApi = axios.create({
	baseURL: Env.EXPO_PUBLIC_POUND_API,
});

export const addAuthHeaderToPoundApi = (session: Session | null) => {
	if (!session) {
		if (authInterceptor) {
			poundApi.interceptors.request.eject(authInterceptor);
			authInterceptor = null;
		}
		return;
	}

	authInterceptor = poundApi.interceptors.request.use((config) => {
		config.headers.Authorization = `Bearer ${session.access_token}`;
		return config;
	});
};
