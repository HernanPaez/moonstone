import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {VirtualListBase as UiVirtualListBase} from '@enact/ui/VirtualList';
import {Component, useState} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@enact/moonstone/IconButton';
import Item from '@enact/moonstone/Item';
import {ActivityPanels, Panel, Header} from '@enact/moonstone/Panels';
import Scroller from '@enact/moonstone/Scroller';
import SwitchItem from '@enact/moonstone/SwitchItem';
import VirtualList, {VirtualListBase} from '@enact/moonstone/VirtualList';

import {storiesOf} from '@storybook/react';

const Config = mergeComponentMetadata('VirtualList', UiVirtualListBase, UiScrollableBase, VirtualListBase);

const
	itemStyle = {
		boxSizing: 'border-box',
		display: 'flex'
	},
	listStyle = {
		height: '200px'
	},
	borderStyle = ri.unit(3, 'rem') + ' solid #202328',
	items = [],
	defaultDataSize = 1000,
	defaultDataSizeForSmallMinLargeSize = 5,
	defaultItemSize = 500,
	defaultMinItemSize = 100,
	prop = {
		scrollbarOption: ['auto', 'hidden', 'visible']
	},
	wrapOption = {
		false: false,
		true: true,
		'&quot;noAnimation&quot;': 'noAnimation'
	},
	// eslint-disable-next-line enact/prop-types, enact/display-name
	renderItem = (ItemComponent, size, vertical, onClick) => ({index, ...rest}) => {
		const style = {
			...(
				vertical ?
					{borderBottom: borderStyle, height: size + 'px'} :
					{borderRight: borderStyle, height: '100%', width: size + 'px', writingMode: 'vertical-lr'}
			),
			...itemStyle
		};
		return (
			<ItemComponent index={index} style={style} onClick={onClick} {...rest}>
				{items[index].item}
			</ItemComponent>
		);
	};

const updateDataSize = (dataSize) => {
	const
		itemNumberDigits = dataSize > 0 ? ((dataSize - 1) + '').length : 0,
		headingZeros = Array(itemNumberDigits).join('0');

	items.length = 0;

	for (let i = 0; i < dataSize; i++) {
		items.push({item :'Item ' + (headingZeros + i).slice(-itemNumberDigits), selected: false});
	}

	return dataSize;
};

updateDataSize(defaultDataSize);

const updateItemSize = ({minSize, dataSize, size}) => ({minSize, size: new Array(dataSize).fill(size)});

class StatefulSwitchItem extends Component {
	static propTypes = {
		index: PropTypes.number
	};

	constructor (props) {
		super(props);
		this.state = {
			prevIndex: props.index,
			selected: items[props.index].selected
		};
	}

	static getDerivedStateFromProps (props, state) {
		if (state.prevIndex !== props.index) {
			return {
				prevIndex: props.index,
				selected: items[props.index].selected
			};
		}

		return null;
	}

	onToggle = () => {
		items[this.props.index].selected = !items[this.props.index].selected;
		this.setState(({selected}) => ({
			selected: !selected
		}));
	};

	render () {
		const props = Object.assign({}, this.props);
		delete props.index;

		return (
			<SwitchItem {...props} onToggle={this.onToggle} selected={this.state.selected}>
				{this.props.children}
			</SwitchItem>
		);
	}
}

const ContainerItemWithControls = SpotlightContainerDecorator(({children, index, style, ...rest}) => {
	const itemHeight = ri.scaleToRem(78);
	const containerStyle = {...style, display: 'flex', width: '100%', height: itemHeight};
	const textStyle = {flex: '1 1 100%', lineHeight: itemHeight};
	const IconStyle = {flex: '0 0 auto', marginTop: ri.scaleToRem(9)};
	return (
		<div {...rest} style={containerStyle}>
			<div style={textStyle}>
				{children}
			</div>
			<IconButton data-index={index} style={IconStyle}>
				{'list'}
			</IconButton>
			<IconButton data-index={index} style={IconStyle}>
				{'star'}
			</IconButton>
			<IconButton data-index={index} style={IconStyle}>
				{'home'}
			</IconButton>
		</div>
	);
});

// eslint-disable-next-line enact/prop-types
const InPanels = ({className, title, ...rest}) => {
	const [index, setIndex] = useState(0);
	function handleSelectBreadcrumb (ev) {
		setIndex(ev.index);
	}

	function handleSelectItem () {
		setIndex(index === 0 ? 1 : 0);
	}

	return (
		<ActivityPanels className={className} index={index} onSelectBreadcrumb={handleSelectBreadcrumb} noCloseButton>
			<Panel>
				<Header type="compact" title={`${title} Panel 0`} key="header" />
				<VirtualList
					id="spotlight-list"
					// eslint-disable-next-line enact/prop-types
					itemRenderer={renderItem(Item, rest.itemSize, true, handleSelectItem)}
					spotlightId="virtual-list"
					{...rest}
				/>
			</Panel>
			<Panel title={`${title} Panel 1`}>
				<Header type="compact" title={`${title} Panel 1`} key="header" />
				<Item onClick={handleSelectItem}>Go Back</Item>
			</Panel>
		</ActivityPanels>
	);
};

class VirtualListWithCBScrollTo extends Component {
	static propTypes = {
		dataSize: PropTypes.number
	};

	componentDidUpdate (prevProps) {
		if (this.props.dataSize !== prevProps.dataSize) {
			this.scrollTo({animate: false, focus: false, index: 0});
		}
	}

	scrollTo = null;

	getScrollTo = (scrollTo) => {
		this.scrollTo = scrollTo;
	};

	render () {
		return (
			<VirtualList
				{...this.props}
				cbScrollTo={this.getScrollTo}
			/>
		);
	}
}

storiesOf('VirtualList', module)
	.add(
		'horizontal scroll in Scroller',
		() => {
			const listProps = {
				dataSize: updateDataSize(number('dataSize', Config, defaultDataSize)),
				direction: 'horizontal',
				focusableScrollbar: boolean('focusableScrollbar', Config),
				horizontalScrollbar: select('horizontalScrollbar', prop.scrollbarOption, Config),
				itemRenderer: renderItem(Item, ri.scale(number('itemSize', Config, 72)), false),
				itemSize: ri.scale(number('itemSize', Config, 72)),
				noScrollByWheel: boolean('noScrollByWheel', Config),
				onKeyDown: action('onKeyDown'),
				onScrollStart: action('onScrollStart'),
				onScrollStop: action('onScrollStop'),
				spacing: ri.scale(number('spacing', Config)),
				style: listStyle,
				verticalScrollbar: select('verticalScrollbar', prop.scrollbarOption, Config),
				wrap: wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]
			};

			return (
				<Scroller >
					<VirtualList {...listProps} key="1" />
					<VirtualList {...listProps} key="2" />
					<VirtualList {...listProps} key="3" />
				</Scroller>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'with more items',
		() => {
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					itemRenderer={renderItem(StatefulSwitchItem, ri.scale(number('itemSize', Config, 72)), true)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config))}
					spotlightDisabled={boolean('spotlightDisabled', Config, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'with small item min size and large item size',
		() => {
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSizeForSmallMinLargeSize))}
					direction="horizontal"
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					itemRenderer={renderItem(Item, ri.scale(number('size', Config, defaultItemSize)), false)}
					itemSize={updateItemSize({
						minSize: ri.scale(number('minSize', Config, defaultMinItemSize)),
						dataSize: number('dataSize', Config, defaultDataSizeForSmallMinLargeSize),
						size: ri.scale(number('size', Config, defaultItemSize))
					})}
					spacing={ri.scale(number('spacing', Config))}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'in Panels',
		context => {
			context.noPanels = true;
			const title = `${context.kind} ${context.story}`.trim();
			return (
				<InPanels
					title={title}
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, Config)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
					noScrollByWheel={boolean('noScrollByWheel', Config)}
					onKeyDown={action('onKeyDown')}
					onScrollStart={action('onScrollStart')}
					onScrollStop={action('onScrollStop')}
					spacing={ri.scale(number('spacing', Config))}
					spotlightDisabled={boolean('spotlightDisabled', Config, false)}
					verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, Config)}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		}
	)
	.add(
		'scrolling to 0 whenever dataSize changes',
		() => {
			return (
				<VirtualListWithCBScrollTo
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					itemRenderer={renderItem(StatefulSwitchItem, ri.scale(number('itemSize', Config, 72)), true)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'overscrollEffectOn',
		() => {
			return (
				<VirtualList
					overscrollEffectOn={{
						arrowKey: false,
						drag: false,
						pageKey: true,
						scrollbarButton: false,
						wheel: false
					}}
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					itemRenderer={renderItem(StatefulSwitchItem, ri.scale(number('itemSize', Config, 72)), true)}
					itemSize={ri.scale(number('itemSize', Config, 72))}
				/>
			);
		},
		{propTables: [Config]}
	)
	.add(
		'with container items have spottable controls',
		() => {
			return (
				<VirtualList
					dataSize={updateDataSize(number('dataSize', Config, defaultDataSize))}
					focusableScrollbar={boolean('focusableScrollbar', Config)}
					itemRenderer={renderItem(ContainerItemWithControls, ri.scale(number('itemSize', Config, 78)), true)}
					itemSize={ri.scale(number('itemSize', Config, 78))}
					wrap={wrapOption[select('wrap', ['false', 'true', '"noAnimation"'], Config)]}
				/>
			);
		},
		{propTables: [Config]}
	);
