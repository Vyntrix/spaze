<script lang="ts">
	import { seo } from '$lib/stores/SeoStore';
	import { onMount } from 'svelte';

	export let title: string;
	export let description: string;

	const loadSeo = () => {
		seo.set({
			title,
			description,
		});

		onMount(() => {
			loadSeo();
		});
	};
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />

	<meta name="keywords" content="spaze, portfolio, developer, showcase, app" />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content="https://spaze.dev" />

	<meta property="twitter:url" content="https://spaze.dev" />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
</svelte:head>
