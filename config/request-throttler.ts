import { ThrottleConfig } from '@ioc:Adonis/Addons/RequestThrottler'

export default {
	maxAttempts: 60,

	maxAttemptPeriod: 1 * 60 * 1000,

	ttlUnits: 'ms',

	cacheStorage: 'redis',

	useOwnCache: true,

	limitExceptionParams: {
		code: 'E_LIMIT_EXCEPTION',
		message: 'Maximum number of login attempts exceeded. Please try again later.',
		status: 429,
	},

	requestKeysForRecognizing: ['method', 'hostname', 'url', 'ip'],
} as ThrottleConfig
