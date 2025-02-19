import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import Spottable from '@enact/spotlight/Spottable';
import ri from '@enact/ui/resolution';
import {Component} from 'react';
import {storiesOf} from '@storybook/react';

import Button from '@enact/moonstone/Button';
import Heading from '@enact/moonstone/Heading';
import Icon from '@enact/moonstone/Icon';
import Item, {ItemBase} from '@enact/moonstone/Item';
import Marquee, {MarqueeController} from '@enact/moonstone/Marquee';

Marquee.displayName = 'Marquee';

const SpottableMarquee = Spottable(Marquee);
const Controller = MarqueeController('div');
const SpottableDiv = MarqueeController({marqueeOnFocus: true}, Spottable('div'));

const LTR = [
	'The quick brown fox jumped over the lazy dog. The bean bird flies at sundown.',
	'Η γρήγορη καφέ αλεπού πήδηξε πάνω από το μεσημέρι. Το πουλί πετά σε φασολιών δύση του ηλίου.',
	'ਤੁਰੰਤ ਭੂਰਾ Fox ਆਲਸੀ ਕੁੱਤੇ ਨੂੰ ਵੱਧ ਗਈ. ਬੀਨ ਪੰਛੀ ਸੂਰਜ ਡੁੱਬਣ \'ਤੇ ਉਡਾਣ ਭਰਦੀ ਹੈ.',
	'速い茶色のキツネは、怠け者の犬を飛び越えた。豆の鳥は日没で飛ぶ。',
	'那只敏捷的棕色狐狸跃过那只懒狗。豆鸟飞日落。',
	'빠른 갈색 여우가 게으른 개를 뛰어 넘었다.콩 조류 일몰에 파리.'
];
const RTL = [
	'שועל החום הזריז קפץ מעל הכלב העצלן.ציפור עפה השעועית עם שקיעה.',
	'قفز الثعلب البني السريع فوق الكلب الكسول. الطيور تطير في الفول عند غروب الشمس.',
	'فوری بھوری لومڑی سست کتے پر چھلانگ لگا. بین پرندوں سوریاست میں پرواز.'
];

const texts = [
	'No marquee no marquee',
	'Ellipsis show before the initial start of the marquee. Ellipsis will not show on the subsequent starts.',
	'Second test to show that the Ellipsis show before the initial start of the marquee. Ellipsis will not show on the subsequent starts.'
];

const disabledDisclaimer = (disabled) => (disabled ? <p style={{fontSize: '70%', fontStyle: 'italic'}}><sup>*</sup>Marquee does not visually respond to <code>disabled</code> state.</p> : <p />);

const MarqueeI18nSamples = I18nContextDecorator({updateLocaleProp: 'updateLocale'}, kind({
	name: 'I18nPanel',

	handlers: {
		// eslint-disable-next-line enact/prop-types
		updateLocale: (ev, {updateLocale}) => updateLocale('ar-SA')
	},

	render: ({updateLocale}) => (
		<div>
			<Heading showLine>Remeasure marquee when locale change causes a font change with different metrics</Heading>
			<Button onClick={updateLocale}>Change locale and marquee stops</Button>
		</div>
	)
}));

const CustomItemBase = ({children, ...rest}) => (
	<div {...rest} style={{display: 'flex', width: 300, alignItems: 'center'}}>
		<Icon>flag</Icon>
		<Marquee id="marqueeText" style={{flex: 1, overflow: 'hidden'}}>{children}</Marquee>
		<Icon>trash</Icon>
	</div>
);

const CustomItem = Spottable(MarqueeController(
	{marqueeOnFocus: true},
	CustomItemBase
));

const MarqueeItem = Spottable(
	MarqueeController(
		{marqueeOnFocus: true},
		ItemBase
	)
);

class MarqueeWithShortContent extends Component {
	constructor (props) {
		super(props);

		this.state = {
			long: false,
			scrollWidth: null,
			width: null
		};
	}

	componentDidMount () {
		this.node = document.querySelector('#marqueeText');
		this.updateSizeInfo();
	}

	componentDidUpdate () {
		this.updateSizeInfo();
	}

	updateSizeInfo = () => {
		if (this.node.scrollWidth !== this.state.scrollWidth) {
			this.setState({
				scrollWidth: this.node.scrollWidth,
				width: this.node.getBoundingClientRect().width
			});
		}
	};

	handleClick = () => {
		this.setState(prevState => ({long: !prevState.long}));
	};

	render () {
		return (
			<div>
				scrollWidth: {this.state.scrollWidth} width: {this.state.width}
				<CustomItem onClick={this.handleClick}>{this.state.long ? 'Very very very very very very very very very long text' : 'text'}</CustomItem>
			</div>
		);
	}
}

class MarqueeWithContentChanged extends Component {
	constructor (props) {
		super(props);
		this.state = {
			count: 0
		};
	}

	handleClick = () => {
		this.setState(({count}) => ({count: ++count % 3}));
	};

	render () {
		return (
			<div>
				<ol>
					<li>Click once to show the ellipsis just before the text marquees the first time.</li>
					<li>Click a second time to show the ellipsis just before the text marquees the first time</li>
					<li>Click again to return to a short string without marquee.</li>
				</ol>
				<Button onClick={this.handleClick}>
					{'Click Me'}
				</Button>
				<Marquee style={{width: '400px'}} marqueeOn={'render'} >{texts[this.state.count]}</Marquee>
			</div>
		);
	}
}

storiesOf('Marquee', module)
	.add(
		'LTR',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<section>
					<Marquee
						style={{width: ri.unit(399, 'rem')}}
						disabled={disabled}
						forceDirection={select('forceDirection', ['', 'ltr', 'rtl'], Marquee, '')}
						marqueeDelay={number('marqueeDelay', Marquee, 1000)}
						marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
						marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
						marqueeOnRenderDelay={number('marqueeOnRenderDelay', Marquee, 1000)}
						marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
					>
						{select('children', LTR, Marquee, LTR[0])}
					</Marquee>
					{disabledDisclaimer(disabled)}
				</section>
			);
		}
	)

	.add(
		'RTL',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<section>
					<Marquee
						style={{width: ri.unit(399, 'rem')}}
						disabled={disabled}
						forceDirection={select('forceDirection', ['', 'ltr', 'rtl'], Marquee, '')}
						marqueeDelay={number('marqueeDelay', Marquee, 1000)}
						marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
						marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
						marqueeOnRenderDelay={number('marqueeOnRenderDelay', Marquee, 1000)}
						marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
						marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
					>
						{select('children', RTL, Marquee, RTL[0])}
					</Marquee>
					{disabledDisclaimer(disabled)}
				</section>
			);
		}
	)

	.add(
		'Synchronized',
		() => {
			const disabled = boolean('disabled', Marquee, false);
			return (
				<Controller style={{width: ri.unit(399, 'rem')}}>
					{LTR.map((children, index) => (
						<Marquee
							disabled={disabled}
							forceDirection={select('forceDirection', ['', 'ltr', 'rtl'], Marquee, '')}
							key={index}
							marqueeDelay={number('marqueeDelay', Marquee, 1000)}
							marqueeDisabled={boolean('marqueeDisabled', Marquee, false)}
							marqueeOn={select('marqueeOn', ['hover', 'render'], Marquee, 'render')}
							marqueeOnRenderDelay={number('marqueeOnRenderDelay', Marquee, 5000)}
							marqueeResetDelay={number('marqueeResetDelay', Marquee, 1000)}
							marqueeSpeed={number('marqueeSpeed', Marquee, 60)}
						>
							{children}
						</Marquee>
					))}
					{disabledDisclaimer(disabled)}
				</Controller>
			);
		}
	)

	.add(
		'On Focus',
		() => (
			<div>
				<Item
					style={{width: ri.unit(399, 'rem')}}
					marqueeOn="focus"
				>
					{LTR[0]}
				</Item>
				<SpottableMarquee
					style={{width: ri.unit(399, 'rem')}}
					marqueeOn="focus"
				>
					{LTR[0]}
				</SpottableMarquee>
			</div>
		)
	)

	.add(
		'Restart Marquee when Marquee completes',
		() => (
			<SpottableDiv>
				<Marquee
					style={{width: ri.unit(399, 'rem')}}
					disabled={false}
					marqueeDelay={1000}
					marqueeDisabled={false}
					marqueeOn="focus"
					marqueeOnRenderDelay={1000}
					marqueeResetDelay={1000}
					marqueeSpeed={60}
				>
					{'The quick brown fox.'}
				</Marquee>
				<Marquee
					style={{width: ri.unit(399, 'rem')}}
					disabled={false}
					marqueeDelay={1000}
					marqueeDisabled={false}
					marqueeOn="focus"
					marqueeOnRenderDelay={1000}
					marqueeResetDelay={1000}
					marqueeSpeed={60}
				>
					{LTR[0]}
				</Marquee>
			</SpottableDiv>
		)
	)

	.add(
		'I18n',
		() => (
			<MarqueeI18nSamples />
		)
	)

	.add(
		'with Short Content',
		() => (
			<div>
				<MarqueeWithShortContent />
			</div>
		)
	)

	.add(
		'with Content Changed',
		() => (
			<MarqueeWithContentChanged />
		)
	)

	.add(
		'with Text Centered',
		() => (
			<div>
				<Heading>Focus on below MarqueeController + Marquee center</Heading>
				<MarqueeItem style={{width: ri.scale(401), display: 'flex', flexDirection: 'column'}}>
					<div>Sample text</div>
					<div style={{width: '100%', flex: 1}}>
						<Marquee
							alignment="center"
							style={{width: '100%'}}
						>
							{'this is marquee text this is marquee text'}
						</Marquee>
					</div>
				</MarqueeItem>
				<br />
				<Heading>MarqueeController + Marquee not center</Heading>
				<MarqueeItem style={{width: ri.scale(401), display: 'flex', flexDirection: 'column', border: '1px solid yellow'}}>
					<div>Sample text</div>
					<div style={{width: '100%', flex: 1, textAlign: 'center'}}>
						<Marquee
							style={{width: '100%'}}
						>
							{'this is marquee text this is marquee text'}
						</Marquee>
					</div>
				</MarqueeItem>
			</div>
		)
	);
