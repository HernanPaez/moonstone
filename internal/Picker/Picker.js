import {forward, stopImmediate} from '@enact/core/handle';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {is} from '@enact/core/keymap';
import platform from '@enact/core/platform';
import {cap, clamp, Job} from '@enact/core/util';
import IdProvider from '@enact/ui/internal/IdProvider';
import Touchable from '@enact/ui/Touchable';
import {SlideLeftArranger, SlideTopArranger, ViewManager} from '@enact/ui/ViewManager';
import Spotlight, {getDirection} from '@enact/spotlight';
import PropTypes from 'prop-types';
import equals from 'ramda/src/equals';
import {Component as ReactComponent} from 'react';
import ReactDOM from 'react-dom';
import shouldUpdate from 'recompose/shouldUpdate';

import Skinnable from '../../Skinnable';

import $L from '../$L';
import {validateRange, validateStepped} from '../validators';
import {extractVoiceProps} from '../util';

import PickerButton from './PickerButton';
import SpottablePicker from './SpottablePicker';

import css from './Picker.module.less';

const holdConfig = {
	events: [
		{name: 'hold', time: 800}
	]
};

const isDown = is('down');
const isLeft = is('left');
const isRight = is('right');
const isUp = is('up');

const Div = Touchable('div');
const SpottableDiv = Touchable(SpottablePicker);

const PickerViewManager = shouldUpdate((props, nextProps) => {
	return (
		props.index !== nextProps.index ||
		!equals(props.children, nextProps.children)
	);
})(ViewManager);

const wrapRange = (min, max, value) => {
	if (value > max) {
		return min;
	} else if (value < min) {
		return max;
	} else {
		return value;
	}
};

const selectIcon = (icon, v, h) => (props) => (props[icon] || (props.orientation === 'vertical' ? v : h));

const selectIncIcon = selectIcon('incrementIcon', 'arrowlargeup', 'arrowlargeright');

const selectDecIcon = selectIcon('decrementIcon', 'arrowlargedown', 'arrowlargeleft');

// Set-up event forwarding
const forwardBlur = forward('onBlur'),
	forwardFocus = forward('onFocus'),
	forwardKeyDown = forward('onKeyDown'),
	forwardKeyUp = forward('onKeyUp'),
	forwardWheel = forward('onWheel');

/**
 * The base component for {@link moonstone/internal/Picker.Picker}.
 *
 * @class Picker
 * @memberof moonstone/internal/Picker
 * @ui
 * @private
 */

const PickerBase = class extends ReactComponent {
	static displayName = 'Picker';

	static propTypes = /** @lends moonstone/internal/Picker.Picker.prototype */ {
		/**
		 * Index for internal ViewManager
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		index: PropTypes.number.isRequired,

		/**
		 * The maximum value selectable by the picker (inclusive).
		 *
		 * The range between `min` and `max` should be evenly divisible by
		 * [step]{@link moonstone/internal/Picker.PickerBase.step}.
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		max: PropTypes.number.isRequired,

		/**
		 * The minimum value selectable by the picker (inclusive).
		 *
		 * The range between `min` and `max` should be evenly divisible by
		 * [step]{@link moonstone/internal/Picker.PickerBase.step}.
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		min: PropTypes.number.isRequired,

		/**
		 * Accessibility hint
		 *
		 * For example, `hour`, `year`, and `meridiem`
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		accessibilityHint: PropTypes.string,

		/**
		 * The "aria-label" for the picker.
		 *
		 * While the `aria-label` will always be set on the root node, that node is only focusable
		 * when the picker is `joined`.
		 *
		 * @type {String}
		 * @memberof moonstone/internal/Picker.PickerBase.prototype
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * Overrides the `aria-valuetext` for the picker.
		 *
		 * By default, `aria-valuetext` is set to the current selected child and `accessibilityHint`
		 * text.
		 *
		 * @type {String}
		 * @memberof moonstone/internal/Picker.PickerBase.prototype
		 * @public
		 */
		'aria-valuetext': PropTypes.string,

		/**
		 * Children from which to pick
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Class name for component
		 *
		 * @type {String}
		 * @public
		 */
		className: PropTypes.string,

		/**
		 * Called with a reference to the root component.
		 *
		 * @type {Object|Function}
		 * @public
		 */
		componentRef: EnactPropTypes.ref,

		/**
		 * Disables voice control.
		 *
		 * @type {Boolean}
		 * @memberof moonstone/internal/Picker.PickerBase.prototype
		 * @public
		 */
		'data-webos-voice-disabled': PropTypes.bool,

		/**
		 * The `data-webos-voice-group-label` for the IconButton of Picker.
		 *
		 * @type {String}
		 * @memberof moonstone/internal/Picker.PickerBase.prototype
		 * @public
		 */
		'data-webos-voice-group-label': PropTypes.string,

		/**
		 * The "aria-label" for the decrement button.
		 *
		 * @type {String}
		 * @default 'previous item'
		 * @public
		 */
		decrementAriaLabel: PropTypes.string,

		/**
		 * Assign a custom icon for the decrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		decrementIcon: PropTypes.string,

		/**
		 * When `true`, the Picker is shown as disabled and does not generate `onChange`
		 * [events]{@link /docs/developer-guide/glossary/#event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The picker id reference for setting aria-controls.
		 *
		 * @type {String}
		 * @private
		 */
		id: PropTypes.string,

		/**
		 * The "aria-label" for the increment button.
		 *
		 * @type {String}
		 * @default 'next item'
		 * @public
		 */
		incrementAriaLabel: PropTypes.string,

		/**
		 * Assign a custom icon for the incrementer. All strings supported by [Icon]{@link moonstone/Icon.Icon} are
		 * supported. Without a custom icon, the default is used, and is automatically changed when
		 * the [orientation]{@link moonstone/Icon.Icon#orientation} is changed.
		 *
		 * @type {String}
		 * @public
		 */
		incrementIcon: PropTypes.string,

		/**
		 * Determines the user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate, while this control is focused. A split control allows full navigation,
		 * but requires individual ENTER presses on the incrementer and decrementer buttons.
		 * Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: PropTypes.bool,

		/**
		 * By default, the picker will animate transitions between items if it has a defined
		 * `width`. Specifying `noAnimation` will prevent any transition animation for the
		 * component.
		 *
		 * @type {Boolean}
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * A function to run when the control should increment or decrement.
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * A function to run when the picker is removed while retaining focus.
		 *
		 * @type {Function}
		 * @private
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the picker when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightUp: PropTypes.func,

		/**
		 * Sets the orientation of the picker, whether the buttons are above and below or on the
		 * sides of the value. Must be either `'horizontal'` or `'vertical'`.
		 *
		 * @type {String}
		 * @default 'horizontal'
		 * @public
		 */
		orientation: PropTypes.oneOf(['horizontal', 'vertical']),

		/**
		 * When `true`, the picker buttons operate in the reverse direction such that pressing
		 * up/left decrements the value and down/right increments the value. This is more natural
		 * for vertical lists of text options where "up" implies a spatial change rather than
		 * incrementing the value.
		 *
		 * @type {Boolean}
		 * @public
		 */
		reverse: PropTypes.bool,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * Allow the picker to only increment or decrement by a given value.
		 *
		 * A step of `2` would cause a picker to increment from 10 to 12 to 14, etc. It must evenly
		 * divide into the range designated by `min` and `max`.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Index of the selected child
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/**
		 * Choose a specific size for your picker. `'small'`, `'medium'`, `'large'`, or set to `null` to
		 * assume auto-sizing. `'small'` is good for numeric pickers, `'medium'` for single or short
		 * word pickers, `'large'` for maximum-sized pickers.
		 *
		 * You may also supply a number. This number will determine the minumum size of the Picker.
		 * Setting a number to less than the number of characters in your longest value may produce
		 * unexpected results.
		 *
		 * @type {String|Number}
		 * @public
		 */
		width: PropTypes.oneOfType([
			PropTypes.oneOf([null, 'small', 'medium', 'large']),
			PropTypes.number
		]),

		/**
		 * Should the picker stop incrementing when the picker reaches the last element? Set `wrap`
		 * to `true` to allow the picker to continue from the opposite end of the list of options.
		 *
		 * @type {Boolean}
		 * @public
		 */
		wrap: PropTypes.bool
	};

	static defaultProps = {
		accessibilityHint: '',
		orientation: 'horizontal',
		spotlightDisabled: false,
		step: 1,
		value: 0
	};

	constructor (props) {
		super(props);

		this.state = {
			// Set to `true` onFocus and `false` onBlur to prevent setting aria-valuetext (which
			// will notify the user) when the component does not have focus
			active: false,
			pressed: 0
		};

		this.initContainerRef = this.initRef('containerRef');

		// Pressed state for this.handleUp
		this.pickerButtonPressed = 0;
	}

	componentDidMount () {
		if (this.props.joined) {
			this.containerRef.addEventListener('wheel', this.handleWheel);
		}
		if (platform.webos) {
			this.containerRef.addEventListener('webOSVoice', this.handleVoice);
		}
	}

	componentDidUpdate (prevProps) {
		if (this.props.joined && !prevProps.joined) {
			this.containerRef.addEventListener('wheel', this.handleWheel);
		} else if (prevProps.joined && !this.props.joined) {
			this.containerRef.removeEventListener('wheel', this.handleWheel);
		}
	}

	componentWillUnmount () {
		this.emulateMouseUp.stop();
		this.throttleWheelInc.stop();
		this.throttleWheelDec.stop();
		if (this.props.joined) {
			this.containerRef.removeEventListener('wheel', this.handleWheel);
		}
		if (platform.webos) {
			this.containerRef.removeEventListener('webOSVoice', this.handleVoice);
		}
	}

	computeNextValue = (delta) => {
		const {min, max, value, wrap} = this.props;
		return wrap ? wrapRange(min, max, value + delta) : clamp(min, max, value + delta);
	};

	adjustDirection = (dir) => this.props.reverse ? -dir : dir;

	hasReachedBound = (delta) => {
		const {value} = this.props;
		return this.computeNextValue(this.adjustDirection(delta)) === value;
	};

	updateValue = (dir) => {
		const {disabled, onChange, step} = this.props;
		dir = this.adjustDirection(dir);
		this.setTransitionDirection(dir);
		if (!disabled && onChange) {
			const value = this.computeNextValue(dir * step);
			onChange({value});
		}
	};

	handleBlur = (ev) => {
		forwardBlur(ev, this.props);

		this.setState({
			active: false
		});
	};

	handleFocus = (ev) => {
		forwardFocus(ev, this.props);

		this.setState({
			active: true
		});
	};

	setTransitionDirection = (dir) => {
		// change the transition direction based on the button press
		this.reverseTransition = !(dir > 0);
	};

	handleDecrement = () => {
		if (!this.hasReachedBound(-this.props.step)) {
			this.updateValue(-1);
			this.setPressedState(-1);
		}
	};

	handleIncrement = () => {
		if (!this.hasReachedBound(this.props.step)) {
			this.updateValue(1);
			this.setPressedState(1);
		}
	};

	setPressedState = (pressed) => {
		const {joined} = this.props;
		if (joined) {
			this.setState({pressed});
		}
	};

	clearPressedState = () => {
		this.pickerButtonPressed = 0;
		this.setState({
			pressed: 0
		});
	};

	emulateMouseUp = new Job(this.clearPressedState, 175);

	handleUp = () => {
		if (this.props.joined && (this.pickerButtonPressed !== 0 || this.state.pressed !== 0)) {
			this.emulateMouseUp.start();
		}
	};

	handleDown = () => {
		const {joined} = this.props;

		if (joined && this.pickerButtonPressed === 1) {
			this.handleIncrement();
			this.emulateMouseUp.start();
		} else if (joined && this.pickerButtonPressed === -1) {
			this.handleDecrement();
			this.emulateMouseUp.start();
		}
	};

	handleIncDown = () => {
		this.pickerButtonPressed = true;
		this.handleIncrement();
	};

	handleWheel = (ev) => {
		const {step} = this.props;
		forwardWheel(ev, this.props);

		const isContainerSpotted = this.containerRef === Spotlight.getCurrent();

		if (isContainerSpotted) {
			const dir = -Math.sign(ev.deltaY);

			// We'll sometimes get a 0/-0 wheel event we need to ignore or the wheel event has reached
			// the bounds of the picker
			if (dir && !this.hasReachedBound(step * dir)) {
				// fire the onChange event
				if (dir > 0) {
					this.throttleWheelInc.throttle();
				} else if (dir < 0) {
					this.throttleWheelDec.throttle();
				}
				// simulate mouse down
				this.setPressedState(dir);
				// set a timer to simulate the mouse up
				this.emulateMouseUp.start();
				// prevent the default scroll behavior to avoid bounce back
				ev.preventDefault();
				ev.stopPropagation();
			}
		}
	};

	throttleWheelInc = new Job(this.handleIncrement, 100);

	throttleWheelDec = new Job(this.handleDecrement, 100);

	setDecPickerButtonPressed = () => {
		this.pickerButtonPressed = -1;
	};

	setIncPickerButtonPressed = () => {
		this.pickerButtonPressed = 1;
	};

	handleHold = () => {
		const {joined} = this.props;
		if (joined && this.pickerButtonPressed === 1) {
			this.handleIncrement();
		} else if (joined && this.pickerButtonPressed === -1) {
			this.handleDecrement();
		}
	};

	handleKeyDown = (ev) => {
		const {
			joined,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			orientation
		} = this.props;
		const {keyCode} = ev;
		forwardKeyDown(ev, this.props);

		if (joined && !this.props.disabled) {
			const direction = getDirection(keyCode);

			const directions = {
				up: this.setIncPickerButtonPressed,
				down: this.setDecPickerButtonPressed,
				right: this.setIncPickerButtonPressed,
				left: this.setDecPickerButtonPressed
			};

			const isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
			const isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

			if (isVertical || isHorizontal) {
				directions[direction]();
			} else if (orientation === 'horizontal' && isDown(keyCode) && onSpotlightDown) {
				onSpotlightDown(ev);
			} else if (orientation === 'horizontal' && isUp(keyCode) && onSpotlightUp) {
				onSpotlightUp(ev);
			} else if (orientation === 'vertical' && isLeft(keyCode) && onSpotlightLeft) {
				onSpotlightLeft(ev);
			} else if (orientation === 'vertical' && isRight(keyCode) && onSpotlightRight) {
				onSpotlightRight(ev);
			}
		}
	};

	handleKeyUp = (ev) => {
		const {
			joined,
			orientation
		} = this.props;
		const {keyCode} = ev;
		forwardKeyUp(ev, this.props);

		if (joined && !this.props.disabled) {
			const isVertical = orientation === 'vertical' && (isUp(keyCode) || isDown(keyCode));
			const isHorizontal = orientation === 'horizontal' && (isRight(keyCode) || isLeft(keyCode));

			if (isVertical || isHorizontal) {
				this.pickerButtonPressed = 0;
			}
		}
	};

	handleDecKeyDown = (ev) => {
		const {keyCode} = ev;
		const direction = getDirection(keyCode);

		if (direction) {
			const {orientation, step} = this.props;

			if (
				!this.hasReachedBound(step) &&
				(
					isRight(keyCode) && orientation === 'horizontal' ||
					isUp(keyCode) && orientation === 'vertical'
				)
			) {
				ev.preventDefault();
				// prevent default spotlight behavior
				stopImmediate(ev);
				// set the pointer mode to false on keydown
				Spotlight.setPointerMode(false);
				Spotlight.focus(this.containerRef.querySelector(`.${css.incrementer}`));
			} else {
				forward(`onSpotlight${cap(direction)}`, ev, this.props);
			}
		}
	};

	handleIncKeyDown = (ev) => {
		const {keyCode} = ev;
		const direction = getDirection(keyCode);

		if (direction) {
			const {orientation, step} = this.props;

			if (
				!this.hasReachedBound(step * -1) &&
				(
					isLeft(keyCode) && orientation === 'horizontal' ||
					isDown(keyCode) && orientation === 'vertical'
				)
			) {
				ev.preventDefault();
				// prevent default spotlight behavior
				stopImmediate(ev);
				// set the pointer mode to false on keydown
				Spotlight.setPointerMode(false);
				Spotlight.focus(this.containerRef.querySelector(`.${css.decrementer}`));
			} else {
				forward(`onSpotlight${cap(direction)}`, ev, this.props);
			}
		}
	};

	handleVoice = (ev) => {
		const voiceIndex = ev && ev.detail && typeof ev.detail.matchedIndex !== 'undefined' && Number(ev.detail.matchedIndex);

		if (Number.isInteger(voiceIndex)) {
			const {max, min, onChange, value} = this.props;
			const voiceValue = min + voiceIndex;
			if (onChange && voiceValue >= min && voiceValue <= max && voiceValue !== value) {
				onChange({value: voiceValue});
				ev.preventDefault();
			}
		}
	};

	determineClasses (decrementerDisabled, incrementerDisabled) {
		const {joined, orientation, width} = this.props;
		const {pressed} = this.state;
		return [
			css.picker,
			css[orientation],
			css[width],
			joined ? css.joined : null,
			!decrementerDisabled && pressed === -1 ? css.decrementing : null,
			!incrementerDisabled && pressed === 1 ? css.incrementing : null,
			this.props.className
		].join(' ');
	}

	calcValueText () {
		const {accessibilityHint, children, index, value} = this.props;
		let valueText = value;

		// Sometimes this.props.value is not equal to node text content. For example, when `PM`
		// is shown in AM/PM picker, its value is `1` and its node.textContent is `PM`. In this
		// case, Screen readers should read `PM` instead of `1`.
		if (children && Array.isArray(children)) {
			valueText = (children[index]) ? children[index].props.children : value;
		} else if (children && children.props && !children.props.children) {
			valueText = children.props.children;
		}

		if (accessibilityHint) {
			valueText = `${valueText} ${accessibilityHint}`;
		}

		return valueText;
	}

	calcButtonLabel (next, valueText) {
		const {decrementAriaLabel, incrementAriaLabel} = this.props;
		let label = next ? incrementAriaLabel : decrementAriaLabel;

		if (label != null) {
			return label;
		}

		return `${valueText} ${next ? $L('next item') : $L('previous item')}`;
	}

	calcDecrementLabel (valueText) {
		return !this.props.joined ? this.calcButtonLabel(this.props.reverse, valueText) : null;
	}

	calcIncrementLabel (valueText) {
		return !this.props.joined ? this.calcButtonLabel(!this.props.reverse, valueText) : null;
	}

	calcAriaLabel (valueText) {
		const
			{'aria-label': ariaLabel, joined, orientation} = this.props,
			hint = orientation === 'horizontal' ? $L('change a value with left right button') : $L('change a value with up down button');

		if (!joined || ariaLabel != null) {
			return ariaLabel;
		}

		return `${valueText} ${hint}`;
	}

	initRef (prop) {
		return (ref) => {
			// need a way, for now, to get a DOM node ref ~and~ use onUp. Likely should rework the
			// wheel handler to avoid this requirement
			// eslint-disable-next-line react/no-find-dom-node
			this[prop] = ref && ReactDOM.findDOMNode(ref);
			if (this.props.componentRef) {
				this.props.componentRef(ref);
			}
		};
	}

	render () {
		const {active} = this.state;
		const {
			'aria-valuetext': ariaValueText,
			children,
			disabled,
			id,
			index,
			joined,
			max,
			min,
			onSpotlightDisappear,
			orientation,
			reverse,
			spotlightDisabled,
			step,
			value,
			width,
			...rest
		} = this.props;

		const voiceProps = extractVoiceProps(rest);
		const voiceLabelsExt = voiceProps['data-webos-voice-labels-ext'];
		delete voiceProps['data-webos-voice-label'];
		delete voiceProps['data-webos-voice-labels'];
		delete voiceProps['data-webos-voice-labels-ext'];

		if (__DEV__) {
			validateRange(value, min, max, PickerBase.displayName);
			validateStepped(value, min, step, PickerBase.displayName);
			validateStepped(max, min, step, PickerBase.displayName, 'max');
		}

		delete rest['aria-label'];
		delete rest.accessibilityHint;
		delete rest.componentRef;
		delete rest.decrementAriaLabel;
		delete rest.decrementIcon;
		delete rest.incrementAriaLabel;
		delete rest.incrementIcon;
		delete rest.noAnimation;
		delete rest.onChange;
		delete rest.onSpotlightDown;
		delete rest.onSpotlightLeft;
		delete rest.onSpotlightRight;
		delete rest.onSpotlightUp;
		delete rest.wrap;

		const incrementIcon = selectIncIcon(this.props);
		const decrementIcon = selectDecIcon(this.props);

		const reachedStart = this.hasReachedBound(step * -1);
		const decrementerDisabled = disabled || reachedStart;
		const reachedEnd = this.hasReachedBound(step);
		const incrementerDisabled = disabled || reachedEnd;
		const classes = this.determineClasses(decrementerDisabled, incrementerDisabled);

		let arranger = orientation === 'vertical' ? SlideTopArranger : SlideLeftArranger;
		let noAnimation = this.props.noAnimation || disabled;

		let sizingPlaceholder = null;
		if (typeof width === 'number' && width > 0) {
			sizingPlaceholder = <div aria-hidden className={css.sizingPlaceholder}>{ '0'.repeat(width) }</div>;
		}

		const valueText = ariaValueText != null ? ariaValueText : this.calcValueText();
		const decrementerAriaControls = !incrementerDisabled ? id : null;
		const incrementerAriaControls = !decrementerDisabled ? id : null;
		const spottablePickerProps = {};
		let Component;

		if (joined) {
			Component = SpottableDiv;
			spottablePickerProps.onSpotlightDisappear = onSpotlightDisappear;
			spottablePickerProps.orientation = orientation;
			spottablePickerProps.spotlightDisabled = spotlightDisabled;
		} else {
			Component = Div;
		}

		return (
			<Component
				{...voiceProps}
				{...rest}
				aria-controls={joined ? id : null}
				aria-disabled={disabled}
				aria-label={this.calcAriaLabel(valueText)}
				className={classes}
				data-webos-voice-intent="Select"
				data-webos-voice-labels-ext={voiceLabelsExt}
				disabled={disabled}
				holdConfig={holdConfig}
				onBlur={this.handleBlur}
				onDown={this.handleDown}
				onFocus={this.handleFocus}
				onHold={this.handleHold}
				onKeyDown={this.handleKeyDown}
				onKeyUp={this.handleKeyUp}
				onUp={this.handleUp}
				onMouseLeave={this.clearPressedState}
				ref={this.initContainerRef}
				{...spottablePickerProps}
			>
				<PickerButton
					{...voiceProps}
					aria-controls={!joined ? incrementerAriaControls : null}
					aria-label={this.calcIncrementLabel(valueText)}
					className={css.incrementer}
					data-webos-voice-label={joined ? this.calcButtonLabel(!reverse, valueText) : null}
					disabled={incrementerDisabled}
					hidden={reachedEnd}
					holdConfig={holdConfig}
					icon={incrementIcon}
					joined={joined}
					onDown={this.handleIncrement}
					onHold={this.handleIncrement}
					onKeyDown={this.handleIncKeyDown}
					onSpotlightDisappear={onSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
				/>
				<div
					aria-disabled={disabled}
					aria-hidden={!active}
					aria-valuetext={valueText}
					className={css.valueWrapper}
					id={id}
					role="spinbutton"
				>
					{sizingPlaceholder}
					<PickerViewManager
						aria-hidden
						arranger={arranger}
						duration={100}
						index={index}
						noAnimation={noAnimation}
						reverseTransition={this.reverseTransition}
					>
						{children}
					</PickerViewManager>
				</div>
				<PickerButton
					{...voiceProps}
					aria-controls={!joined ? decrementerAriaControls : null}
					aria-label={this.calcDecrementLabel(valueText)}
					className={css.decrementer}
					data-webos-voice-label={joined ? this.calcButtonLabel(reverse, valueText) : null}
					disabled={decrementerDisabled}
					hidden={reachedStart}
					holdConfig={holdConfig}
					icon={decrementIcon}
					joined={joined}
					onDown={this.handleDecrement}
					onHold={this.handleDecrement}
					onKeyDown={this.handleDecKeyDown}
					onSpotlightDisappear={onSpotlightDisappear}
					spotlightDisabled={spotlightDisabled}
				/>
			</Component>
		);
	}
};

const Picker = IdProvider(
	{generateProp: null, prefix: 'p_'},
	Skinnable(
		PickerBase
	)
);

export default Picker;
export {Picker};
export PickerItem from './PickerItem';
