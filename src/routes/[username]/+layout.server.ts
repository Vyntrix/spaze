import { LL, setLocale } from "$lib/i18n/i18n-svelte"
import { error } from "@sveltejs/kit"
import { get } from "svelte/store"

export async function load({ params, locals }) {
  setLocale(locals.locale);
  const $LL = get(LL);
  error(404, $LL.errors.notFound())
}