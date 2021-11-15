import {useI18nContext} from '@enact/i18n/I18nDecorator';
import {useCallback} from 'react';
import ToggleButton from '@enact/moonstone/ToggleButton';

const LocaleSwitch = (props) => {
	const {rtl, updateLocale} = useI18nContext();
	const onToggle = useCallback(() => {
		updateLocale(!rtl ? 'ar-SA' : 'en-US');
	}, [rtl, updateLocale]);

	return (
		<ToggleButton onToggle={onToggle} {...props}>RTL</ToggleButton>
	);
};

export default LocaleSwitch;