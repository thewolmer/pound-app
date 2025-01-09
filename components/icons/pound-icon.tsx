import { use$ } from '@legendapp/state/react';
import { View } from 'react-native';
import { Defs, G, LinearGradient, Path, Stop, Svg } from 'react-native-svg';

import { preferenceSettings$ } from '~/context/preferences';

export const PoundIcon = () => {
	const isDarkTheme = use$(preferenceSettings$.isDarkTheme);
	const fill = isDarkTheme ? '#cecac0' : '#010000';
	const originalWidth = 698.02;
	const originalHeight = 154.75;
	const aspectRatio = originalWidth / originalHeight;

	return (
		<View style={{ width: '100%', aspectRatio }}>
			<Svg viewBox={`0 0 ${originalWidth} ${originalHeight}`} width="100%" height="100%">
				<Defs>
					<LinearGradient
						id="pound-gradient"
						x1="21.51"
						y1="100.25"
						x2="71.79"
						y2="150.54"
						gradientUnits="userSpaceOnUse"
					>
						<Stop offset="0" stopColor="#4826bc" />
						<Stop offset="0.07" stopColor="#4e2bc5" />
						<Stop offset="0.28" stopColor="#5f38de" />
						<Stop offset="0.5" stopColor="#6c42f0" />
						<Stop offset="0.73" stopColor="#7348fb" />
						<Stop offset="1" stopColor="#764aff" />
					</LinearGradient>
				</Defs>
				<G>
					<G>
						<Path
							fill={fill}
							strokeWidth="0"
							d="M197.53,31.65h22.86v10.55c7.21-7.91,17.23-12.66,29.19-12.66,24.97,0,43.61,20.22,43.61,46.95s-18.64,46.95-43.61,46.95c-11.96,0-21.98-4.75-29.19-12.66v43.96h-22.86V31.65ZM269.63,76.5c0-14.07-10.38-24.8-24.62-24.8s-24.62,10.73-24.62,24.8,10.55,24.8,24.62,24.8,24.62-10.73,24.62-24.8Z"
						/>
						<Path
							fill={fill}
							strokeWidth="0"
							d="M300.95,76.5c0-26.73,20.75-46.95,48.18-46.95s48.18,20.22,48.18,46.95-20.75,46.95-48.18,46.95-48.18-20.22-48.18-46.95ZM373.76,76.5c0-14.07-10.37-24.8-24.62-24.8s-24.62,10.73-24.62,24.8,10.55,24.8,24.62,24.8,24.62-10.73,24.62-24.8Z"
						/>
						<Path
							fill={fill}
							strokeWidth="0"
							d="M407.88,89.16V31.65h22.86v50.82c0,11.43,7.39,18.82,18.46,18.82,11.78,0,19.7-7.56,19.7-19.17V31.65h22.86v89.69h-22.86v-9.85c-6.86,7.91-16.18,11.96-27.26,11.96-20.22,0-33.76-13.54-33.76-34.29Z"
						/>
						<Path
							fill={fill}
							strokeWidth="0"
							d="M504.94,31.65h22.86v10.02c7.03-7.91,16.88-12.13,28.49-12.13,21.1,0,34.99,13.72,34.99,34.82v56.98h-22.86v-49.59c0-12.13-7.74-20.05-19.52-20.05-12.66,0-21.1,8.09-21.1,20.4v49.24h-22.86V31.65Z"
						/>
						<Path
							fill={fill}
							strokeWidth="0"
							d="M602.18,76.5c0-26.73,18.82-46.95,43.79-46.95,11.96,0,21.98,4.75,29.19,12.66V0h22.86v121.34h-22.86v-10.55c-7.21,7.91-17.23,12.66-29.19,12.66-24.97,0-43.79-20.22-43.79-46.95ZM675.16,76.5c0-14.07-10.55-24.8-24.8-24.8s-24.62,10.73-24.62,24.8,10.55,24.8,24.62,24.8,24.8-10.73,24.8-24.8Z"
						/>
					</G>
					<G>
						<Path
							fill="#764aff"
							strokeWidth="0"
							d="M142.84,8.79H32.68c-11.44,0-21.8,9.28-23.14,20.72L0,111.38h0c4.93-2.74,10.36-4.19,15.72-4.19h115.65c11.44,0,21.8-9.28,23.14-20.72l6.64-56.95c1.33-11.44-6.86-20.72-18.31-20.72Z"
						/>
						<Path
							fill="url(#pound-gradient)"
							strokeWidth="0"
							d="M65.45,146.31H21.78c-12.95,0-22.22-10.49-20.71-23.44h0c.42-3.59,3.67-6.51,7.26-6.51h84.05l-.76,6.51c-1.51,12.95-13.23,23.44-26.17,23.44Z"
						/>
					</G>
				</G>
			</Svg>
		</View>
	);
};
