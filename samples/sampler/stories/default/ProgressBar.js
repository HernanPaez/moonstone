import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata, nullify} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';

import ProgressBar, {ProgressBarTooltip} from '@enact/moonstone/ProgressBar';

const ProgressBarConfig = mergeComponentMetadata('ProgressBar', ProgressBar);
const ProgressBarTooltipConfig = mergeComponentMetadata('ProgressBarTooltip', ProgressBarTooltip);

ProgressBar.displayName = 'ProgressBar';
ProgressBarTooltip.displayName = 'ProgressBarTooltip';

storiesOf('Moonstone', module)
	.add(
		'ProgressBar',
		() => {
			// added here to force Storybook to put the ProgressBar tab first
			const disabled = boolean('disabled', ProgressBarConfig);

			// tooltip is first so it appears at the top of the tab. the rest are alphabetical
			const tooltip = boolean('tooltip', ProgressBarTooltipConfig);
			const position = select('position', ['', 'above', 'above left', 'above right', 'above before', 'above after', 'before', 'left', 'right', 'after', 'below', 'below left', 'below right', 'below before', 'below after'], ProgressBarTooltipConfig, '');
			const side = nullify(select('side (Deprecated)', ['', 'after', 'before', 'left', 'right'], ProgressBarTooltipConfig, ''));

			return (
				<ProgressBar
					backgroundProgress={number('backgroundProgress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.5)}
					disabled={disabled}
					highlighted={boolean('highlighted', ProgressBarConfig)}
					orientation={select('orientation', ['horizontal', 'vertical'], ProgressBarConfig, 'horizontal')}
					progress={number('progress', ProgressBarConfig, {range: true, min: 0, max: 1, step: 0.01}, 0.4)}
					style={{marginLeft: ri.scaleToRem(72), marginRight: ri.scaleToRem(72)}}
				>
					{tooltip ? (
						<ProgressBarTooltip
							position={position}
							side={side}
						/>
					) : null}
				</ProgressBar>
			);
		},
		{
			info: {
				text: 'The basic ProgressBar'
			}
		}
	);
