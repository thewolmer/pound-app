import React from 'react';
import { View } from 'react-native';

export const IconWrapper = ({ children }: { children: React.ReactNode }) => {
	return <View className="flex items-center justify-center rounded-2xl bg-primary/25 p-3">{children}</View>;
};
