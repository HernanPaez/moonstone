import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';

import IncrementSlider, {IncrementSliderBase, IncrementSliderTooltip} from '@enact/moonstone/IncrementSlider';

import {decrementIcons, incrementIcons} from './icons';

const IncrementSliderConfig = mergeComponentMetadata('IncrementSlider', IncrementSliderBase, IncrementSlider);
const IncrementSliderTooltipConfig = mergeComponentMetadata('IncrementSliderTooltip', IncrementSliderTooltip);

IncrementSlider.displayName = 'IncrementSlider';

storiesOf('Moonstone', module)
	.add(
		'IncrementSlider',
		() => {
			const side = select('side (Deprecated)', ['after', 'before', 'left', 'right'], IncrementSliderTooltipConfig, 'after');
			const tooltip = boolean('tooltip', IncrementSliderTooltipConfig);
			const percent = boolean('percent', IncrementSliderTooltipConfig);

			return (
				<IncrementSlider
					backgroundProgress={number('backgroundProgress', IncrementSliderConfig, {range: true, min: 0, max: 1, step: 0.01})}
					decrementIcon={select('decrementIcon', ['', ...decrementIcons], IncrementSliderConfig)}
					disabled={boolean('disabled', IncrementSliderConfig)}
					incrementIcon={select('incrementIcon', ['', ...incrementIcons], IncrementSliderConfig)}
					knobStep={number('knobStep', IncrementSliderConfig)}
					max={number('max', IncrementSliderConfig)}
					min={number('min', IncrementSliderConfig)}
					noFill={boolean('noFill', IncrementSliderConfig)}
					onChange={action('onChange')}
					orientation={select('orientation', ['horizontal', 'vertical'], IncrementSliderConfig)}
					step={number('step', IncrementSliderConfig)} // def: 1
					style={{marginLeft: ri.scaleToRem(72), marginRight: ri.scaleToRem(72)}}
				>
					{tooltip ? (
						<IncrementSliderTooltip
							percent={percent}
							side={side}
						/>
					) : null}
				</IncrementSlider>
			);
		},
		{
			info: {
				text: 'Basic usage of IncrementSlider'
			}
		}
	);
