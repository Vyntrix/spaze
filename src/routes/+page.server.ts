import prismaClient from '$lib/db.server';

export async function load({ locals }) {
	return {
		user: locals.session?.user,
		account: await prismaClient.account.findFirst({
			where: {
				userId: locals.session?.user?.id,
			},
		}),
	};
}
