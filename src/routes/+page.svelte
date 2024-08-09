<script lang="ts">
	import { signIn } from '@auth/sveltekit/client';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import LL from '$/lib/i18n/i18n-svelte.js';
	import { seo } from '$/lib/stores/SeoStore';
	import { page } from '$app/stores';
	import { userStore } from '$/lib/stores/UserStore';

	export let data;

	let loading = false;

	seo.set({
		title: 'spaze',
		description: 'spaze',
	});

	$: userStore.set({
		user: data.user,
	});
</script>

<div class="hero-container flex flex-col items-center justify-center p-4">
	{#if $page.data.session}
		hi
	{:else}
		<p class="my-4 text-center">{$LL.pages.root.messages.tagline()}</p>
		<button
			disabled={loading}
			on:click|once={function loginClick() {
				loading = true;
				signIn('google');
			}}
			class="variant-filled-primary btn cursor-pointer">
			{#if loading}
				<ProgressRadial class="ml-2 h-6 w-6" stroke={100} />
			{:else}
				{$LL.buttons.login()}
			{/if}
		</button>
	{/if}
</div>
