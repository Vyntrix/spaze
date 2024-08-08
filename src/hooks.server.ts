import type { Handle, HandleFetch, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

// Performance Monitoring
export const performanceMonitoring: Handle = async ({ event, resolve }) => {
	const route = event.url

	const start = performance.now()
	const response = await resolve(event)
	const end = performance.now()

	const responseTime = end - start

	if (responseTime > 2000) {
		console.log(`🐢 ${route} took ${responseTime.toFixed(2)} ms`)
	}

	if (responseTime < 1000) {
		console.log(`🚀 ${route.pathname} took ${responseTime.toFixed(2)} ms`)
	}

	return response
}

export const handle = sequence(performanceMonitoring)

// Error Handling
export const handleError: HandleServerError = async ({ error }) => {
	console.log('🚨 An error occurred |', (error as Error)?.message)
}

// Fetch Handling
export const handleFetch: HandleFetch = ({ request, fetch }) => {
	if (request.url.startsWith('http')) {
		const url = request.url.replace('http', 'https')
		request = new Request(url, request)

		console.log(`🔗 Fetching ${url}`)
	}

	return fetch(request)
}
