import { observable } from '@legendapp/state';
import { syncObservable } from '@legendapp/state/sync';

import { persistOptions } from '~/config/legend-state';
import { supabase } from '~/lib/supabase';

import { auth$ } from './auth.store';

interface PushNotificationState {
	token: string | null;
	isEnabled: boolean;
}

export const pushNotification$ = observable<PushNotificationState>({
	token: null,
	isEnabled: true,
});

syncObservable(
	pushNotification$,
	persistOptions({
		persist: {
			name: 'push-notification',
		},
	})
);

export const setPushNotificationToken = async (token: string) => {
	const token$ = pushNotification$.token.get();

	if (token !== token$) {
		const session = auth$.session.get();
		if (!session) return;
		const { data } = await supabase
			.from('expo_push_token')
			.insert({
				expo_push_token: token,
				person_id: session.user.id,
			})
			.select();
		if (data) {
			pushNotification$.token.set(token);
		}
	}
};

export const deletePushNotificationToken = async () => {
	const token$ = pushNotification$.token.get();
	if (!token$) return;
	await supabase.from('expo_push_token').delete().eq('expo_push_token', token$);
	pushNotification$.token.set(null);
};
