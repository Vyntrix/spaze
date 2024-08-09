import type { BaseTranslation } from '../i18n-types';

const en = {
	message: 'Hello World',
	buttons: {
		create: 'Create',
		view: 'View',
		edit: 'Edit',
		update: 'Update',
		logOut: 'Logout',
		login: 'Login',
		remove: 'Remove',
		add: 'Add',
	},
	messages: {
		pleaseWait: 'Please wait...',
	},
	pages: {
		root: {
			loggedIn: {
				messages: {
					createList: 'Click Create to get started.',
				},
			},
			messages: {
				tagline:
					"The ultimate portfolio site for showcasing your projects, skills, and experiences as a developer.",
			},
		},
		onboarding: {
			buttons: {
				letsGo: 'Lets Go!',
			},
			labels: {
				username: 'Username',
				uploadFile: 'Upload File',
			},
			messages: {
				main: "Welcome to listd! Let's setup your profile.",
				avatar: 'Upload your avatar.',
				final: "That's all! Let's get started!",
			},
		},
	},
} satisfies BaseTranslation;

export default en;
