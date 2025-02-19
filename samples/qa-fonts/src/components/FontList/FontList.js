import Heading from '@enact/moonstone/Heading';
import SlotItem from '@enact/moonstone/SlotItem';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import Status from '../Status';

import css from './FontList.module.less';

const FontList = kind({
	name: 'FontList',

	propTypes: {
		fonts: PropTypes.array
	},

	styles: {
		css,
		className: 'list'
	},

	render: ({children, fonts, ...rest}) => {
		return (
			<section {...rest}>
				<Heading>{children}</Heading>
				{fonts && fonts.map((font, i) => {
					let sample;
					if (Array.isArray(font)) [font, sample] = font;
					const fontForDisplay = font.replace('1em ', '');
					return (
						<SlotItem key={'item' + i}>
							<slotBefore>
								{document.fonts.check(font) ?
									<Status loaded>Loaded</Status> :
									<Status>Not Loaded</Status>
								}
							</slotBefore>
							{fontForDisplay}
							<slotAfter>
								<span style={{font: font + ', cursive'}}>{sample || fontForDisplay}</span>
							</slotAfter>
						</SlotItem>
					);
				})}
			</section>
		);
	}
});

export default FontList;
