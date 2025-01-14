/* eslint-disable react/no-unescaped-entities */

import Button from '@enact/moonstone/Button';
import kind from '@enact/core/kind';
import Region from '@enact/moonstone/Region';
import Scroller from '@enact/moonstone/Scroller';

import css from './ReadOrder.module.less';

const ReadOrder = kind({
	name: 'ReadOrder',

	render: (props) => (
		<Scroller {...props}>
			<h2>Single Level</h2>

			<Region className={css.region} title="With aria-label">
				<p>Focusing Button 1 should read "With aria-label, Button 1, button"</p>
				<Button size="small">Button 1</Button>
			</Region>

			<Region className={css.region} title="With aria-labelledby" aria-labelledby="header1">
				<div id="header1">The Panel</div>
				<p>Focusing Button 2 should read "The Panel, Button 2, button"</p>
				<Button size="small">Button 2</Button>
			</Region>

			<Region className={css.region} title="With aria-labelledby + aria-label" aria-labelledby="header2">
				<div id="header2" aria-label="The Panel">Header (with aria-label="The Panel")</div>
				<p>Focusing Button 3 should read "The Panel, Button 3, button"</p>
				<Button size="small">Button 3</Button>
			</Region>

			<Region title="Switching Focus Within Level">
				<p>Focusing Button 4 should read "Switching Focus Within Level, Button 4, button"</p>
				<Button size="small">Button 4</Button>
				<p>Focusing Button 5 should read "Button 5, button"</p>
				<Button size="small">Button 5</Button>
			</Region>

			<h2>Multi Level</h2>

			<Region className={css.region} title="With aria-label">
				<p>Focusing Button 6 should read "With aria-label, Popup, Button 6, button"</p>
				<div role="dialog" aria-label="Popup">
					<p>Dialog with aria-label="Popup"</p>
					<Button size="small">Button 6</Button>
				</div>
			</Region>

			<Region className={css.region} title="With aria-labelledby" aria-labelledby="header3">
				<div id="header3">The Panel</div>
				<p>Focusing Button 7 should read "The Panel, Popup, Button 7, button"</p>
				<div role="dialog" aria-labelledby="dialogtitle1">
					<div id="dialogtitle1">Popup</div>
					<Button size="small">Button 7</Button>
				</div>
			</Region>

			<Region className={css.region} title="With aria-labelledby + aria-label" aria-labelledby="header4">
				<div id="header4" aria-label="The Panel">Header</div>
				<p>Focusing Button 8 should read "The Panel, Popup, Button 8, button"</p>
				<div role="dialog" aria-label="Popup">
					<p>Dialog with aria-label="Popup"</p>
					<Button size="small">Button 8</Button>
				</div>
			</Region>

			<Region className={css.region} title="Moving down a Level">
				<p>Focusing Button 9 should read "Moving down a Level, Button 9, button"</p>
				<Button size="small">Button 9</Button>
				<p>Focusing Button 10 should read "Popup, Button 10, button"</p>
				<div role="dialog" aria-label="Popup">
					<p>Dialog with aria-label="Popup"</p>
					<Button size="small">Button 10</Button>
				</div>
			</Region>

			<Region title="Moving up a Level">
				<p>Focusing Button 11 should read "Moving up a Level, Popup, Button 11, button"</p>
				<div role="dialog" aria-label="Popup">
					<p>Dialog with aria-label="Popup"</p>
					<Button size="small">Button 11</Button>
				</div>
				<p>Focusing Button 12 should read "Moving up a Level, Button 12, button"</p>
				<Button size="small">Button 12</Button>
			</Region>

			<h2>Region within a region</h2>

			<Region className={css.region} title="Outside region">
				<Region title="Inside region">
					<p>Focusing Button 13 should read "Outside region, Inside region, Button 13, button"</p>
					<Button size="small">Button 13</Button>
				</Region>
			</Region>

			<Region className={css.region} title="Outside region">
				<p>Focusing Button 14 should read "Outside region, Button 14, button"</p>
				<Button size="small">Button 14</Button>
				<Region title="Inside region">
					<p>Focusing Button 15 should read "Inside region, Button 15, button"</p>
					<Button size="small">Button 15</Button>
				</Region>
			</Region>
		</Scroller>
	)
});

export default ReadOrder;
export {
	ReadOrder
};
