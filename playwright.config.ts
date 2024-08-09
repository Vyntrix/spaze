import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	use: {
		locale: 'en-US',
		// headless: false,
	},
	webServer: {
		command: `dotenv -e .env.test -- pnpm run preview`,
		port: 4173,
	},
	testDir: 'tests',
};

export default config;
