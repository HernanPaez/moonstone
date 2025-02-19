import Group from '@enact/ui/Group';
import Item from '@enact/moonstone/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {Component} from 'react';
import ScrollerComponent from '@enact/moonstone/Scroller';
import ViewManager from '@enact/ui/ViewManager';

import Button from '../views/Button';
import ContextualPopupDecorator from '../views/ContextualPopupDecorator';
import DayPicker from '../views/DayPicker';
import Dialog from '../views/Dialog';
import Dropdown from '../views/Dropdown';
import EditableIntegerPicker from '../views/EditableIntegerPicker';
import ExpandableItem from '../views/ExpandableItem';
import ExpandableList from '../views/ExpandableList';
import GroupItem from '../views/GroupItem';
import Input from '../views/Input';
import ItemView from '../views/Item';
import Notification from '../views/Notification';
import Option from '../views/Option';
import Panels from '../views/Panels';
import Picker from '../views/Picker';
import Popup from '../views/Popup';
import ProgressBar from '../views/ProgressBar';
import ReadAlert from '../views/ReadAlert';
import ReadOrder from '../views/ReadOrder';
import Scroller from '../views/Scroller';
import Slider from '../views/Slider';
import Spinner from '../views/Spinner';
import TooltipDecorator from '../views/TooltipDecorator';
import VideoPlayer from '../views/VideoPlayer';
import VirtualGridList from '../views/VirtualGridList';
import VirtualList from '../views/VirtualList';

import css from './App.module.less';
import Home from './Home';
import View from './View';

const views = [
	{title: 'About qa-a11y', view: Home},
	{debugProps: true, title: 'Option', view: Option},
	{title: 'Button', view: Button},
	{title: 'ContextualPopupDecorator', view: ContextualPopupDecorator},
	{title: 'DayPicker', view: DayPicker},
	{title: 'Dialog', view: Dialog},
	{title: 'Dropdown', view: Dropdown},
	{title: 'EditableIntegerPicker', view: EditableIntegerPicker},
	{title: 'ExpandableItem', view: ExpandableItem},
	{title: 'ExpandableList', view: ExpandableList},
	{title: 'GroupItem', view: GroupItem},
	{title: 'Input', view: Input},
	{title: 'Item', view: ItemView},
	{title: 'Notification', view: Notification},
	{isHeader: false, title: 'Panels', view: Panels},
	{title: 'Picker', view: Picker},
	{title: 'Popup', view: Popup},
	{title: 'ProgressBar', view: ProgressBar},
	{title: 'ReadAlert', view: ReadAlert},
	{title: 'ReadOrder', view: ReadOrder},
	{title: 'Scroller', view: Scroller},
	{title: 'Slider', view: Slider},
	{title: 'Spinner', view: Spinner},
	{title: 'TooltipDecorator', view: TooltipDecorator},
	{isAriaHidden: true, title: 'VideoPlayer', view: VideoPlayer},
	{title: 'VirtualGridList', view: VirtualGridList},
	{title: 'VirtualList', view: VirtualList}
];

class AppBase extends Component {
	constructor () {
		super();
		this.state = {
			isDebugMode: false,
			selected: 0
		};
	}

	handleChangeView = (state) => this.setState(state);

	handleDebug = () => this.setState((state) => ({isDebugMode: !state.isDebugMode}));

	render () {
		const
			{isDebugMode, selected} = this.state,
			debugAriaClass = isDebugMode ? 'aria debug' : null;

		return (
			<Layout {...this.props}>
				<Cell component={ScrollerComponent} size="20%">
					<Group childComponent={Item} itemProps={{className: css.navItem}} onSelect={this.handleChangeView} select="radio">
						{views.map((view) => view.title)}
					</Group>
				</Cell>
				<Cell className={debugAriaClass} component={ViewManager} index={selected}>
					{views.map((view, i) => (
						<View {...view} handleDebug={this.handleDebug} isDebugMode={isDebugMode} key={i} />
					))}
				</Cell>
			</Layout>
		);
	}
}

const App = MoonstoneDecorator(AppBase);

export default App;
