import { configureReanimatedLogger, ReanimatedLogLevel } from 'react-native-reanimated';

// temp disable reanimated logger because we are getting a lot of
// [Reanimated] Reading from `value` during component render.
// Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.
//https://github.com/dohooo/react-native-reanimated-carousel/issues/706

configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false, // Disable strict mode
});
