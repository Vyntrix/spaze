import en from '../en';
import type { Translation } from '../i18n-types';

const de = {
	...(en as Translation),
	message: 'Hallo Welt',
} satisfies Translation;

export default de;
