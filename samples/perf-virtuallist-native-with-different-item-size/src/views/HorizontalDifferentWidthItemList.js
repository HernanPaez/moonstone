import Item from '@enact/moonstone/Item';
import {VirtualListNative} from '@enact/moonstone/VirtualList';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import {Component} from 'react';

const
	languages = [
		'한국어 - 한국',
		'English - United States',
		'Português - Brasil',
		'Português - Portugal',
		'Čeština - Česká republika',
		'Dansk - Danmark',
		'Deutsch - Deutschland',
		'Ελληνική γλώσσα - Ελλάδα',
		'Español - España',
		'Suomi - Suomi'
	],
	numOfItems = 100,
	fontSize = ri.scale(20),
	oneLineSize = ri.scale(50),
	lineHeight = `${oneLineSize - 10}px`,
	spacing = 50;

class DifferenctWidthItem extends Component {
	static propTypes = {
		index: PropTypes.number,
		items: PropTypes.array
	};

	itemStyleDefault = {
		position: 'absolute',
		height: '100%',
		borderRight: 'solid 10px gray',
		boxSizing: 'border-box',
		fontSize,
		lineHeight,
		whiteSpace: 'pre'
	};

	innerItemStyleDefault = {
		height: '100%',
		writingMode: 'vertical-rl'
	};

	render () {
		const
			{index, items, style: itemStyleFromList, ...rest} = this.props,
			{title: children, width} = items[index],
			itemStyle = {...this.itemStyleDefault, ...itemStyleFromList, width: width + 'px'};


		return (
			<Item {...rest} style={itemStyle}>
				<div style={this.innerItemStyleDefault}>
					{children}
				</div>
			</Item>
		);
	}
}

class HorizontalDifferenctWidthItemList extends Component {
	constructor (props) {
		let
			position = 0,
			itemSize = [],
			items = [];

		super(props);

		for (let i = 0; i < numOfItems; i++) {
			const
				numOfLines = Math.ceil(Math.random() * 6),
				width = numOfLines * oneLineSize;

			items.push({
				title: (`${('00' + i).slice(-3)} | ${position}px | ${languages[i % 10]}\n`).repeat(numOfLines),
				width
			});
			itemSize.push(width);
			position += (width + spacing);
		}

		this.state = {
			items,
			itemSize
		};
	}

	renderItem = (props) => {
		return <DifferenctWidthItem {...props} />;
	};

	render () {
		return (
			<VirtualListNative
				{...this.props}
				childProps={{
					items: this.state.items
				}}
				dataSize={this.state.items.length}
				direction="horizontal"
				focusableScrollbar
				itemRenderer={this.renderItem}
				itemSize={{
					minSize: oneLineSize,
					size: this.state.itemSize
				}}
				spacing={spacing}
			/>
		);
	}
}

export default HorizontalDifferenctWidthItemList;
