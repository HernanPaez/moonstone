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
	fontSize = ri.scale(31),
	oneLineSize = ri.scale(50),
	lineHeight = `${oneLineSize}px`,
	spacing = 40;

class DifferenctHeightItem extends Component {
	static propTypes = {
		index: PropTypes.number,
		items: PropTypes.array
	};

	itemStyleDefault = {
		position: 'absolute',
		width: '100%',
		borderBottom: 'solid 10px gray',
		boxSizing: 'border-box',
		fontSize,
		lineHeight,
		whiteSpace: 'pre'
	};

	render () {
		const
			{index, items, style: itemStyleFromList, ...rest} = this.props,
			{title: children, height} = items[index],
			itemStyle = {...this.itemStyleDefault, ...itemStyleFromList};


		return (
			<Item {...rest} style={itemStyle}>
				<div style={{height}}>
					{children}
				</div>
			</Item>
		);
	}
}

class VerticalDifferentHeightItemList extends Component {
	constructor (props) {
		let
			position = 0,
			itemSize = [],
			items = [];

		super(props);

		for (let i = 0; i < numOfItems; i++) {
			const
				numOfLines = Math.ceil(Math.random() * 6),
				height = numOfLines * oneLineSize;

			items.push({
				title: (`${('00' + i).slice(-3)} - ${position}px - ${languages[i % 10]}\n`).repeat(numOfLines),
				height
			});
			itemSize.push(height);
			position += (height + spacing);
		}

		this.state = {
			items,
			itemSize
		};
	}

	renderItem = (props) => {
		return <DifferenctHeightItem {...props} />;
	};

	render () {
		return (
			<VirtualListNative
				{...this.props}
				childProps={{
					items: this.state.items
				}}
				dataSize={this.state.items.length}
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

export default VerticalDifferentHeightItemList;
