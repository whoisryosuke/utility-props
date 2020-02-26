![Screenshot of Utility Props in action](./screenshot.png)

# utility-props

Utility CSS meets web components. Control your components using "utility" props that reflect changes to CSS custom properties. Style flexible and declarative components using it's props:

```js
<x-box width={[1, 0.5, 0.3]} bg="black" color="white" p="2"></x-box>
```

Helps enforce your design system or style guide's color and spacing guidelines by converting props to theme tokens if possible. Also supports responsive props that change styling based on viewport (see supported list below).

## Getting Started

1. Install the library as a dependency:

```shell
npm i utility-props
```

2. Use the setup function to give your web components utility props:

```js
import { setup } from 'utility-props';

// Somewhere inside your component:
setup(['width'], 'component', this);
// Parameters are:
// Prop list (as array), component name, and a "ref" to the web component
```

3. Add CSS custom properties to your web component's CSS for each utility prop:

```css
:host {
  width: var(--sui-component-width);
}
```

> See [the framework integration section](#integrating-with-frameworks) for specific details on adding to your web component library.

## Supported CSS Props

Here are the following CSS properties you can use a "utility props":

### Responsive

- width
- max-width
- min-width
- height
- max-height
- min-height
- padding as `p`
- margin as `m`
- font-size
- text-align

### Not Responsive

- font-family
- line-height
- font-weight
- letter-spacing
- color
- background-color
- border
- border-top as `bt`
- border-bottom as `bb`
- border-left as `bl`
- border-right as `br`
- border-width
- border-style
- border-color
- border-radius
- display
- position
- z-index
- top
- bottom
- left
- right
- align-items
- align-content
- justify-content
- flex-wrap
- flex-direction

## How It Works

You call the setup function as part of the web component's lifecycle, ideally running each time a prop changes. The setup checks for each CSS prop you provide, parses the prop value into a CSS custom property, and attaches it to the web component's inline style block. The custom property is derived by the component name your provide, as well as an optional namespace parameter in the setup function. There's a bit more that happens behind the scenes to parse or convert your prop values, like handling colors or spacing, you can learn more about that below.

Inside your component's CSS, you setup your CSS to use each CSS custom property that this library creates and updates. For example, for the `font-family` prop, you need the following CSS: `font-family: var(--sui-componentname-font-family);`. So for every utility prop you use, you need a matching CSS property for it that uses the appropriate CSS custom property.

### Converting Prop Values

All prop values go through a "conversion" process, based on the prop type. For example, the `width` prop uses the "sizing" conversion, versus the `p` (or padding) prop which uses "spacing" conversions.

The following are the type of props and how they're handled:

- **Sizing**: Converts any value less than 1 to a percent (e.g. `0.3` becomes `30%`). Otherwise, the prop value is provided directly as the CSS custom property.
- **Color**: Converts any value that is not hex, RGB, or HSL to a theme token (aka CSS custom property like `--sui-colors-red`). Otherwise, the prop value is provided directly as the CSS custom property.
- **Spacing**: Converts any number less than 8 to a spacing theme token (aka CSS custom property like `--sui-spacing-3`). Otherwise, the prop value is provided directly as the CSS custom property.
- **Default**: All prop values are provided directly as the CSS custom property.

**Size props**:

- width
- min-width
- max-width
- height
- min-height
- max-height

**Color prop**:

- color
- background-color
- border-color

**Spacing prop**:

- padding
- margin
- top
- bottom
- left
- right
- border-width
- border-top
- border-bottom
- border-left
- border-right
- line-height
- font-size

### Responsive Props

For props that can be responsive, you can provide an array as a value to change styling based on breakpoints/viewports.

```js
// Renders a box that's 100% on mobile, 50% on tablet, and 30% on desktop.
<x-box width={[1, 0.5, 0.3]}></x-box>
<x-box width={['100%', '50%', '30%']}></x-box>
// If your app doesn't support array-based props, you can use comma-separated values
<x-box width="1,0.5,0.3"></x-box>
<x-box width="100%,50%,30%"></x-box>
```

To enable responsive props, you have to add CSS custom properties to your component for each breakpoint you define. By default the library uses **mobile**, **tablet**, and **desktop** viewports. You can define any name and any number of viewports you need. Here's an example of the required CSS for the default breakpoints:

`your-component.css`:

```css
:host {
  /* Optional. Allows you to set defaults. */
  --sui-box-width: 100%;
  --sui-box-height: auto;
  --sui-box-padding: 0;
  --sui-box-margin: 0;
  --sui-box-font-size: var(--sui-fonts-sizes-body, inherit);

  --sui-box-align-items: center;
  --sui-box-align-content: center;
  --sui-box-justify-content: normal;
  --sui-box-flex-direction: row;
  --sui-box-flex-wrap: wrap;

  /* Everything below is required (assuming you use all responsive props) */

  width: var(--sui-box-width);
  min-width: var(--sui-box-min-width);
  max-width: var(--sui-box-max-width);
  height: var(--sui-box-height);
  max-height: var(--sui-box-max-height);
  min-height: var(--sui-box-min-height);
  padding: var(--sui-box-padding);
  margin: var(--sui-box-margin);

  font-size: var(--sui-box-font-size);
  text-align: var(--sui-box-text-align);
}

/* 
* Create media queries for each breakpoint (mobile, tablet, desktop by default)
* You control your own breakpoint widths here.
*/
@media only screen and (min-width: 400px) {
  :host {
    width: var(--sui-box-width-mobile, var(--sui-box-width));
    max-width: var(--sui-box-max-width-mobile, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-mobile, var(--sui-box-min-width));
    height: var(--sui-box-height-mobile, var(--sui-box-height));
    max-height: var(--sui-box-max-height-mobile, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-mobile, var(--sui-box-min-height));

    padding: var(--sui-box-padding-mobile, var(--sui-box-padding));
    margin: var(--sui-box-margin-mobile, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-mobile, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-mobile, var(--sui-box-text-align));
  }
}

@media only screen and (min-width: 800px) {
  :host {
    width: var(--sui-box-width-tablet, var(--sui-box-width));
    max-width: var(--sui-box-max-width-tablet, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-tablet, var(--sui-box-min-width));
    height: var(--sui-box-height-tablet, var(--sui-box-height));
    max-height: var(--sui-box-max-height-tablet, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-tablet, var(--sui-box-min-height));

    padding: var(--sui-box-padding-tablet, var(--sui-box-padding));
    margin: var(--sui-box-margin-tablet, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-tablet, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-tablet, var(--sui-box-text-align));
  }
}

@media only screen and (min-width: 1200px) {
  :host {
    width: var(--sui-box-width-desktop, var(--sui-box-width));
    max-width: var(--sui-box-max-width-desktop, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-desktop, var(--sui-box-min-width));
    height: var(--sui-box-height-desktop, var(--sui-box-height));
    max-height: var(--sui-box-max-height-desktop, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-desktop, var(--sui-box-min-height));

    padding: var(--sui-box-padding-desktop, var(--sui-box-padding));
    margin: var(--sui-box-margin-desktop, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-desktop, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-desktop, var(--sui-box-text-align));
  }
}
```

### Theme Tokens

This library also defaults to using **"theme tokens"** if possible by way of CSS custom properties. For "color" based props for instance, if you use words, instead of hex codes, RGB, or HSL color values, the library will try to use a CSS custom property based on your word.

```js
<x-box color="blue"></x-box>
// Renders a box with text that references the CSS custom property for blue
// Becomes: `--sui-componentname-color: var(--sui-colors-blue);`
// Used in CSS: `color: var(--sui-componentname-color);`
```

"Spacing" properties, on the other hand, will access the appropriate CSS custom property using the prop value if you provide a number from 1-10. For example, `<x-box p="3">` would equate to `--sui-componentname-padding: var(--sui-spacing-1)`. [See the conversion section above](#converting-prop-values) for more details on how this works.

In order for the theme tokens to work, you must define them somewhere in your application. You can either put it in the `:root` of your global CSS or create a component (like a `<theme-provider>`) to pass the tokens (or CSS custom properties) down to nested components. Here's an example for the `<theme-provider>` component CSS:

```css
:host {
  /* sizes */
  /* Required for any spacing props (padding, margin) */
  --sui-spacing: 8px;
  --sui-spacing-0: 0px;
  --sui-spacing-1: 4px;
  --sui-spacing-2: 8px;
  --sui-spacing-3: 16px;
  --sui-spacing-4: 32px;
  --sui-spacing-5: 64px;
  --sui-spacing-6: 128px;
  --sui-spacing-7: 256px;
  --sui-spacing-8: 512px;

  /* Colors */
  /* None of these names are required. Just here as example. */
  /* Use any color names you'd like, even separated by dashes  */
  --sui-colors-white: #fefefe;
  --sui-colors-black: #010101;
  --sui-colors-red: #db2828;
  --sui-colors-orange: #f2711c;
  --sui-colors-yellow: #fbbd08;
  --sui-colors-green: #21ba45;
  --sui-colors-blue: #2185d0;
  --sui-colors-violet: #6435c9;
  --sui-colors-primary: blue;
  --sui-colors-secondary: #6d59f0;
  --sui-colors-text: rgba(0, 0, 0, 0.6);
  --sui-colors-text-inverted: rgba(255, 255, 255, 0.9);
  --sui-colors-bg: #fff;
  --sui-colors-muted: #f6f6f9;
  --sui-colors-gray: #d3d7da;
  --sui-colors-highlight: hsla(205, 100%, 40%, 0.125);
  --sui-colors-disabled: rgba(40, 40, 40, 0.3);
  --sui-colors-disabled-inverted: rgba(225, 225, 225, 0.3);
}
```

## Integrating with Frameworks

utility-props is framework agnostic and works with any web component framework that supports CSS, props, and lifecycle management (to re-render based on prop changes).

### StencilJS

1. Use the `setup()` method in the `componentWillRender` lifecycle. It accepts an array of CSS props, the component name (used for the CSS custom property), and the `this` reference (to access props and styling):

```ts
componentWillRender() {
  setup(
    [
      "width",
      "max-width",
      "min-width",
      "height",
      "max-height",
      "min-height",
      "padding",
      "margin",
      "font-size",
      "text-align",

      "font-family",
      "line-height",
      "font-weight",
      "letter-spacing",
      "color",
      "background-color",
      "border",
      "border-top",
      "border-bottom",
      "border-left",
      "border-right",
      "border-width",
      "border-style",
      "border-color",
      "border-radius",
      "display",
      "position",
      "z-index",
      "top",
      "bottom",
      "left",
      "right",
      "align-items",
      "align-content",
      "justify-content",
      "flex-wrap",
      "flex-direction"
    ],
    "box",
    this
  );
}
```

2. Add any CSS props from the setup to your component, as well as an `el` prop that references the web component. Make sure they're camelCased and not snake-case:

```ts
@Component({
  tag: 'sui-box',
  styleUrl: 'box.css',
  shadow: true,
})
export class Box {
  /**
   * Ref to component in DOM
   */
  @Element() el: HTMLElement;

  /**
   * Responsive width
   */
  @Prop() width: string | string[] | number | number[];

  /**
   * Responsive min-width
   */
  @Prop() minWidth: string | string[] | number | number[];

  /**
   * Responsive max-width
   */
  @Prop() maxWidth: string | string[] | number | number[];

  /**
   * Responsive height
   */
  @Prop() height: string | string[] | number | number[];

  /**
   * Responsive min-height
   */
  @Prop() minHeight: string | string[] | number | number[];

  /**
   * Responsive max-height
   */
  @Prop() maxHeight: string | string[] | number | number[];

  /**
   * CSS property for font-family
   */
  @Prop() fontFamily: string | string[] | number | number[];

  /**
   * Responsive fontSize
   */
  @Prop() fontSize: string | string[] | number | number[];

  /**
   * Responsive textAlign
   */
  @Prop() textAlign: string | string[] | number | number[];

  /**
   * CSS property for lineHeight
   */
  @Prop() lineHeight: string | string[] | number | number[];

  /**
   * CSS property for fontWeight
   */
  @Prop() fontWeight: string | string[] | number | number[];

  /**
   * CSS property for letterSpacing
   */
  @Prop() letterSpacing: string | string[] | number | number[];

  /**
   * CSS property for responsive margin
   */
  @Prop() m: string | string[] | number | number[];

  /**
   * CSS property for responsive padding
   */
  @Prop() p: string | string[] | number | number[];

  /**
   * CSS property for text color
   */
  @Prop() color: string;

  /**
   * CSS property for background color
   */
  @Prop() background: string;
  @Prop() bg: string;

  /**
   * CSS property display
   */
  @Prop() display: string;

  /**
   * CSS property position
   */
  @Prop() position: string;

  /**
   * CSS properties for positioning
   */
  @Prop() top: string | number;
  @Prop() bottom: string | number;
  @Prop() left: string | number;
  @Prop() right: string | number;
  @Prop() zIndex: string | number;

  /**
   * CSS property for border
   */
  @Prop() border: string | number;

  /**
   * CSS property for borderTop
   */
  @Prop() bt: string | number;

  /**
   * CSS property for borderBottom
   */
  @Prop() bb: string | number;

  /**
   * CSS property for borderLeft
   */
  @Prop() bl: string | number;

  /**
   * CSS property for borderRight
   */
  @Prop() br: string | number;

  /**
   * CSS property for borderWidth
   */
  @Prop() borderWidth: string | number;

  /**
   * CSS property for borderStyle
   */
  @Prop() borderStyle: string;

  /**
   * CSS property for borderColor
   */
  @Prop() borderColor: string;

  /**
   * CSS property for borderRadius
   */
  @Prop() borderRadius: string | number;

  /**
   * Flex property align-items
   */
  @Prop() alignItems: string;

  /**
   * Flex property align-content
   */
  @Prop() alignContent: string;

  /**
   * Flex property justify-content
   */
  @Prop() justifyContent: string;

  /**
   * Flex property flex-wrap
   */
  @Prop() flexWrap: string;

  /**
   * Flex property flex-direction
   */
  @Prop() flexDirection: string;
}
```

3. Add the following CSS to your web component's CSS file:

```css
/**
  * Find and replace "box" with the component name you provided in the setup
  * If you use optional namespace in the setup function, find and replace "sui" with it
*/
:host {
  --sui-box-width: 100%;
  --sui-box-height: auto;
  --sui-box-display: block;
  --sui-box-padding: 0;
  --sui-box-margin: 0;
  --sui-box-color: var(--sui-colors-text, #000);
  --sui-box-background-color: var(--sui-colors-bg, transparent);
  --sui-box-font-size: var(--sui-fonts-sizes-body, inherit);
  --sui-box-font-family: var(--sui-fonts-body);
  --sui-box-font-weight: var(--sui-fonts-weights-body);
  --sui-box-line-height: var(--sui-fonts-line-body);

  --sui-box-align-items: center;
  --sui-box-align-content: center;
  --sui-box-justify-content: normal;
  --sui-box-flex-direction: row;
  --sui-box-flex-wrap: wrap;

  width: var(--sui-box-width);
  min-width: var(--sui-box-min-width);
  max-width: var(--sui-box-max-width);
  height: var(--sui-box-height);
  max-height: var(--sui-box-max-height);
  min-height: var(--sui-box-min-height);
  padding: var(--sui-box-padding);
  margin: var(--sui-box-margin);

  display: var(--sui-box-display);
  position: var(--sui-box-position);
  z-index: var(--sui-box-zIndex);
  top: var(--sui-box-top);
  bottom: var(--sui-box-bottom);
  left: var(--sui-box-left);
  right: var(--sui-box-right);

  color: var(--sui-box-color);
  background-color: var(--sui-box-background-color);

  font-family: var(--sui-box-font-family);
  font-size: var(--sui-box-font-size);
  text-align: var(--sui-box-text-align);
  line-height: var(--sui-box-line-height);
  font-weight: var(--sui-box-font-weight);
  letter-spacing: var(--sui-box-letter-spacing);

  border-width: var(--sui-box-border-width);
  border-style: var(--sui-box-border-style);
  border-color: var(--sui-box-border-color);
  border: var(--sui-box-border);
  border-top: var(--sui-box-border-top);
  border-bottom: var(--sui-box-border-bottom);
  border-left: var(--sui-box-border-left);
  border-right: var(--sui-box-border-right);
  border-radius: var(--sui-box-border-radius);

  align-items: var(--sui-box-align-items);
  align-content: var(--sui-box-align-content);
  justify-content: var(--sui-box-justify-content);
  flex-direction: var(--sui-box-flex-direction);
  flex-wrap: var(--sui-box-flex-wrap);

  box-sizing: border-box;
}

@media only screen and (min-width: 400px) {
  :host {
    width: var(--sui-box-width-mobile, var(--sui-box-width));
    max-width: var(--sui-box-max-width-mobile, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-mobile, var(--sui-box-min-width));
    height: var(--sui-box-height-mobile, var(--sui-box-height));
    max-height: var(--sui-box-max-height-mobile, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-mobile, var(--sui-box-min-height));

    padding: var(--sui-box-padding-mobile, var(--sui-box-padding));
    margin: var(--sui-box-margin-mobile, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-mobile, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-mobile, var(--sui-box-text-align));
  }
}

@media only screen and (min-width: 800px) {
  :host {
    width: var(--sui-box-width-tablet, var(--sui-box-width));
    max-width: var(--sui-box-max-width-tablet, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-tablet, var(--sui-box-min-width));
    height: var(--sui-box-height-tablet, var(--sui-box-height));
    max-height: var(--sui-box-max-height-tablet, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-tablet, var(--sui-box-min-height));

    padding: var(--sui-box-padding-tablet, var(--sui-box-padding));
    margin: var(--sui-box-margin-tablet, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-tablet, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-tablet, var(--sui-box-text-align));
  }
}

@media only screen and (min-width: 1200px) {
  :host {
    width: var(--sui-box-width-desktop, var(--sui-box-width));
    max-width: var(--sui-box-max-width-desktop, var(--sui-box-max-width));
    min-width: var(--sui-box-min-width-desktop, var(--sui-box-min-width));
    height: var(--sui-box-height-desktop, var(--sui-box-height));
    max-height: var(--sui-box-max-height-desktop, var(--sui-box-max-height));
    min-height: var(--sui-box-min-height-desktop, var(--sui-box-min-height));

    padding: var(--sui-box-padding-desktop, var(--sui-box-padding));
    margin: var(--sui-box-margin-desktop, var(--sui-box-margin));

    font-size: var(--sui-box-font-size-desktop, var(--sui-box-font-size));
    text-align: var(--sui-box-text-align-desktop, var(--sui-box-text-align));
  }
}
```

### lit-element

Coming soon.

## Local Development

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

<img src="https://user-images.githubusercontent.com/4060187/52168303-574d3a00-26f6-11e9-9f3b-71dbec9ebfcb.gif" width="600" />

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

<img src="https://user-images.githubusercontent.com/4060187/52168322-a98e5b00-26f6-11e9-8cf6-222d716b75ef.gif" width="600" />

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.

## Release

### CircleCI

This project is tested, built, and then released to NPM using CircleCI. You can find the configuration here: `.circleci/config.yml`.

> Requires an environmental token in CircleCI for your NPM auth token. [See their guide for more info.](https://circleci.com/blog/publishing-npm-packages-using-circleci-2-0/)

# References

- Bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx)
- [Styled System](https://styled-system.com/)
- [System UI](https://system-ui.com/theme/)
- [Tachyons](http://tachyons.io/)
- [Semantic UI](https://semantic-ui.com/)
