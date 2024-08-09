import { redirect, type Handle, type HandleFetch, type HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale } from '$lib/i18n/i18n-util.js';
import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/core/providers/google';
import PrismaAdapter from '$lib/prisma/client';
import { config } from '$/lib/config.server';
import prismaClient from './lib/db.server';

const handleDetectLocale = (async ({ event, resolve }) => {
	// TODO: get lang from cookie / user setting
	const acceptLanguageHeaderDetector = initAcceptLanguageHeaderDetector(event.request);
	const locale = detectLocale(acceptLanguageHeaderDetector);
	event.locals.locale = locale;

	return resolve(event, { transformPageChunk: ({ html }) => html.replace('%lang%', locale) });
}) satisfies Handle;

const handleAuth = (async (...args) => {
	const [{ event }] = args;
	return SvelteKitAuth({
		trustHost: true,
		adapter: PrismaAdapter(prismaClient),
		providers: [
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			Google({
				id: 'google',
				name: 'Google',
				clientId: config.GOOGLE_CLIENT_ID,
				clientSecret: config.GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						scope:
							'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid https://www.googleapis.com/auth/youtube.readonly',
					},
				},
			}),
		],
		callbacks: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			async session({ session, user }) {
				session.user = {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
					settings: user.settings,
					username: user.username,
				};
				event.locals.session = session;
				return session;
			},
		},
		events: {
			async signIn(message) {
				if (message.account && message.account.provider === 'google') {
					const username = await updateAccountUsername(message.account);
					if (event.locals.session?.user) {
						event.locals.session.user.username = username || '@Unknown';
					}
				}
			},
			async createUser(message) {
				if (!message.user.settings) {
					const locale = await prismaClient.locale.findFirst({
						where: {
							id: event.locals.locale,
						},
					});
					const settings = await prismaClient.userSettings.create({
						data: {
							localeId: locale?.id ?? 'en-US',
							userId: message.user.id!,
						},
					});
					message.user.settings = settings;
				}
			},
		},
	})(...args);
}) satisfies Handle;

const protectedHandle = (async ({ event, resolve }) => {
	await event.locals.getSession();
	if (!event.locals.session && event.route.id?.includes('(protected)')) {
		redirect(302, '/');
	}
	return resolve(event);
}) satisfies Handle;

// Performance Monitoring
export const performanceMonitoring: Handle = async ({ event, resolve }) => {
	const route = event.url;

	const start = performance.now();
	const response = await resolve(event);
	const end = performance.now();

	const responseTime = end - start;

	if (responseTime > 2000) {
		console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`);
	}

	if (responseTime < 1000) {
		console.log(`🚀 ${route.pathname} took ${responseTime.toFixed(2)} ms`);
	}

	return response;
};

export const handle = sequence(
	performanceMonitoring,
	handleDetectLocale,
	handleAuth,
	protectedHandle
);

// Error Handling
export const handleError: HandleServerError = async ({ error }) => {
	console.log('🚨 An error occurred |', (error as Error)?.message);
};

// Fetch Handling
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	if (request.url.startsWith('http')) {
		const url = request.url.replace('http', 'https');
		request = new Request(url, request);

		console.log(`🔗 Fetching ${url}`);
	}

	return fetch(request);
};
