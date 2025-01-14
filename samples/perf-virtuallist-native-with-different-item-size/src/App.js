import Dropdown from '@enact/moonstone/Dropdown';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';

import {Component} from 'react';

import HorizontalDifferentWidthItemList from './views/HorizontalDifferentWidthItemList';
import VerticalDifferentHeightItemList from './views/VerticalDifferentHeightItemList';
import VerticalExpandableDifferentHeightItemList from './views/VerticalExpandableDifferentHeightItemList';

const views = [
	HorizontalDifferentWidthItemList,
	VerticalDifferentHeightItemList,
	VerticalExpandableDifferentHeightItemList
];

const viewNames = [
	'HorizontalDifferentWidthItemList',
	'VerticalDifferentHeightItemList',
	'VerticalExpandableDifferentHeightItemList'
];

const defaultViewIndex = 0;

class VirtualListSample extends Component {
	constructor (props) {
		super(props);

		this.state = {
			view: views[defaultViewIndex]
		};
	}

	onSelect = ({selected}) => {
		this.setState({view: views[selected]});
	};

	render () {
		const View = this.state.view;

		return (
			<div {...this.props}>
				<Dropdown
					direction="down"
					onSelect={this.onSelect}
					size="large"
					title={viewNames[defaultViewIndex]}
					width="large"
				>
					{viewNames}
				</Dropdown>
				<View style={{height: '600px'}} />
			</div>
		);
	}
}

export default MoonstoneDecorator(VirtualListSample);
