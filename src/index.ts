export interface IUtilityProps {
  /**
   * Responsive width
   */
  width?: string | string[] | number | number[];

  /**
   * Responsive min-width
   */
  minWidth?: string | string[] | number | number[];

  /**
   * Responsive max-width
   */
  maxWidth?: string | string[] | number | number[];

  /**
   * Responsive height
   */
  height?: string | string[] | number | number[];

  /**
   * Responsive min-height
   */
  minHeight?: string | string[] | number | number[];

  /**
   * Responsive max-height
   */
  maxHeight?: string | string[] | number | number[];

  /**
   * Responsive fontSize
   */
  fontSize?: string | string[] | number | number[];

  /**
   * Responsive textAlign
   */
  textAlign?: string | string[] | number | number[];

  /**
   * CSS property for lineHeight
   */
  lineHeight?: string | string[] | number | number[];

  /**
   * CSS property for fontWeight
   */
  fontWeight?: string | string[] | number | number[];

  /**
   * CSS property for letterSpacing
   */
  letterSpacing?: string | string[] | number | number[];

  /**
   * CSS property for responsive margin
   */
  m?: string | string[] | number | number[];

  /**
   * CSS property for responsive padding
   */
  p?: string | string[] | number | number[];

  /**
   * CSS property for text color
   */
  color?: string;

  /**
   * CSS property for background color
   */
  bg?: string;

  /**
   * CSS property display
   */
  display?: string;

  /**
   * CSS property position
   */
  position?: string;

  /**
   * CSS properties for positioning
   */
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  zIndex?: string | number;

  /**
   * CSS property for border
   */
  border?: string | number;

  /**
   * CSS property for borderTop
   */
  bt?: string | number;

  /**
   * CSS property for borderBottom
   */
  bb?: string | number;

  /**
   * CSS property for borderLeft
   */
  bl?: string | number;

  /**
   * CSS property for borderRight
   */
  br?: string | number;

  /**
   * CSS property for borderWidth
   */
  bw?: string | number;

  /**
   * CSS property for borderStyle
   */
  borderStyle?: string;

  /**
   * CSS property for borderColor
   */
  borderColor?: string;

  /**
   * CSS property for borderRadius
   */
  borderRadius?: string | number;

  /**
   * Flex property align-items
   */
  alignItems?: string;

  /**
   * Flex property align-content
   */
  alignContent?: string;

  /**
   * Flex property justify-content
   */
  justifyContent?: string;

  /**
   * Flex property flex-wrap
   */
  flexWrap?: string;

  /**
   * Flex property flex-direction
   */
  flexDirection?: string;
}

export interface IComponentProps extends IUtilityProps {
  /**
   * Ref to component in DOM
   */
  el: HTMLElement;

  [key: string]: any;
}

export interface ICSSProps {
  [key: string]: any;
}

const camelCaseNames: ICSSProps = {
  'max-width': 'maxWidth',
  'min-width': 'minWidth',
  'max-height': 'maxHeight',
  'min-height': 'minHeight',
  'font-size': 'fontSize',
  'text-align': 'textAlign',
  'font-family': 'fontFamily',
  'line-height': 'lineHeight',
  'font-weight': 'fontWeight',
  'letter-spacing': 'letterSpacing',
  'background-color': 'bg',
  'border-top': 'bt',
  'border-bottom': 'bb',
  'border-left': 'bl',
  'border-right': 'br',
  'border-width': 'borderWidth',
  'border-style': 'borderStyle',
  'border-color': 'borderColor',
  'border-radius': 'borderRadius',
  'z-index': 'zIndex',
  'align-items': 'alignItems',
  'align-content': 'alignContent',
  'justify-content': 'justifyContent',
  'flex-wrap': 'flexWrap',
  'flex-direction': 'flexDirection',
  width: 'width',
  height: 'height',
  padding: 'p',
  margin: 'm',
  color: 'color',
  border: 'border',
  display: 'display',
  position: 'position',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

const updateComponentStyleBlock = (
  componentStyleBlock: HTMLStyleElement,
  customProperty: string,
  propValue: any
) => {
  const regexSearch = new RegExp(`(${customProperty})(.*?);`);
  const replaceCSS = `${customProperty}: ${propValue};`;
  componentStyleBlock.innerHTML = componentStyleBlock.innerHTML.replace(
    regexSearch,
    replaceCSS
  );
};

/**
 * Converts number to percent
 * or returns the value (for units with px/em/etc)
 * @param number Number or string (of a number or CSS unit)
 */
const convertNumToPercent = (number: number | string) => {
  let parsedNum;
  if (typeof number === 'string') {
    parsedNum = parseFloat(number);
  } else {
    parsedNum = number;
  }
  // If it's a number type, assume user wants percent
  // If string passed, parsed num should be 1 or less, and contain no characters
  if (
    typeof number == 'number' ||
    (typeof number == 'string' && parsedNum <= 1 && !/[a-z]/i.test(number))
  ) {
    return `${Math.floor(parsedNum * 100)}%`;
  }
  return number;
};

/**
 * Checks if value is color unit (hex, rgb, hsl)
 * and returns custom property (or returns value)
 * @param number Component prop
 */
const convertColorToUnit = (color: string | any, namespace: string) => {
  if (
    typeof color === 'string' &&
    !color.includes('#') &&
    !color.includes('hsl') &&
    !color.includes('rgb')
  ) {
    return `var(--${namespace}-colors-${color})`;
  }
  return color;
};

/**
 * Checks if value is number and return spacing custom property
 * Or return value if possible CSS property (px/em)
 */
const convertSpacingToUnit = (spacing: number | string, namespace: string) => {
  if (
    (typeof spacing === 'number' && spacing <= 9) ||
    (typeof spacing === 'string' &&
      !spacing.includes('px') &&
      parseInt(spacing) <= 9)
  ) {
    return `var(--${namespace}-spacing-${spacing})`;
  }
  return spacing;
};

/**
 * Returns conversion function for the prop
 * @param propName CSS property name
 */
export function convertProps(propName: string) {
  switch (propName) {
    case 'width':
    case 'min-width':
    case 'max-width':
    case 'height':
    case 'min-height':
    case 'max-height':
      return convertNumToPercent;

    case 'color':
    case 'background-color':
    case 'border-color':
      return convertColorToUnit;

    case 'padding':
    case 'margin':
    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
    case 'border-width':
    case 'border-top':
    case 'border-bottom':
    case 'border-left':
    case 'border-right':
    case 'line-height':
    case 'font-size':
      return convertSpacingToUnit;

    // By default return the prop value
    default:
      return (prop: any) => prop;
  }
}

function isNameValid(
  propName: string,
  camelCaseNames: ICSSProps
): ICSSProps[string] {
  return propName in camelCaseNames;
}

function isPropValid(
  validName: string,
  prop: IComponentProps
): IComponentProps[string] {
  return validName in prop;
}

/**
 * Sets the custom property directly and converts prop to theme value if possible
 *
 * @param namespace Namespace to preprend to beginning of CSS Custom Property
 * @param componentName Name of component, used for custom property namespacing
 * @param prop The prop value
 * @param propName The name of the CSS property to update
 */
export function setCustomProperty(
  namespace: string,
  componentName: string,
  prop: IComponentProps,
  propName: string
) {
  const conversion = convertProps(propName);
  const customProperty = `--${namespace}-${componentName}-${propName}`;
  let componentStyleBlock = prop?.el?.shadowRoot?.querySelector('style');

  if (!isNameValid(propName, camelCaseNames)) {
    throw new Error(
      `Invalid property name "${propName}". No camel case exists, which means the prop isn't in our API. Check the docs for our supported list of props names (like 'font-size').`
    );
  }
  const validName = camelCaseNames[propName];
  if (!isPropValid(validName, prop)) {
    throw new Error(
      `Invalid property name "${validName}". Prop name doesn't exist in component (${componentName}) props. Maybe add to component's props/attrributes.`
    );
  }
  const validProp = prop[validName];

  if (validProp !== undefined) {
    const propValue = conversion(validProp, namespace);

    if (componentStyleBlock) {
      return updateComponentStyleBlock(
        componentStyleBlock,
        customProperty,
        propValue
      );
    }
  }
}

/**
 * Sets CSS custom properties on component using elementStyle
 * Checks if prop is array, then loops to set CSS Custom Props
 * Converts any numbers to units based on prop name/type
 *
 * @param namespace Namespace to preprend to beginning of CSS Custom Property
 * @param componentName Name of component, used for custom property namespacing
 * @param prop The prop value
 * @param propName The name of the CSS property to update
 */
export function responsiveProps(
  namespace: string,
  componentName: string,
  prop: IComponentProps,
  propName: string,
  breakpoints: string[]
) {
  const customProperty = `--${namespace}-${componentName}-${propName}`;
  // Convert width/height to percent
  // Or convert to unit (em/px)
  const conversion = convertProps(propName);
  let componentStyleBlock = prop?.el?.shadowRoot?.querySelector('style');

  // If string is comma separated, process into array
  let processProp = prop[camelCaseNames[propName]];
  if (typeof processProp === 'string' && processProp.includes(',')) {
    processProp = processProp.split(',');
  }
  // Check if prop is an array we can loop through
  // Or sets prop to CSS var by default
  if (
    processProp &&
    (Array.isArray(processProp) || typeof processProp === 'object')
  ) {
    // Loop through array and map props to breakpoint CSS vars
    for (let index = 0; index < processProp.length; index++) {
      if (componentStyleBlock) {
        const currentValue = processProp[index];
        const propValue = conversion(currentValue, namespace);
        updateComponentStyleBlock(
          componentStyleBlock,
          `${customProperty}-${breakpoints[index]}`,
          propValue
        );
        // Sets first array value (mobile) to default breakpoint prop value
        if (index === 0) {
          updateComponentStyleBlock(
            componentStyleBlock,
            customProperty,
            propValue
          );
        }
      }
    }
    // Check here for numbers to convert to percent
    // e.g. 0.5 would return 50%
  } else if (typeof processProp === 'number') {
    // Replace CSS Custom Property in Style Block with Regex
    const propValue = conversion(processProp, namespace);
    if (componentStyleBlock) {
      updateComponentStyleBlock(componentStyleBlock, customProperty, propValue);
    }
    // If user types "25%", "10em", etc -- return that
  } else if (processProp !== undefined) {
    // Replace CSS Custom Property in Style Block with Regex
    if (componentStyleBlock) {
      updateComponentStyleBlock(
        componentStyleBlock,
        customProperty,
        processProp
      );
    }
  }
}

function createProp(
  propName: string,
  componentName: string,
  props: IComponentProps,
  namespace: string,
  breakpoints: string[]
) {
  switch (propName) {
    case 'width':
    case 'max-width':
    case 'min-width':
    case 'height':
    case 'max-height':
    case 'min-height':
    case 'padding':
    case 'margin':
    case 'font-size':
    case 'text-align':
      return responsiveProps(
        namespace,
        componentName,
        props,
        propName,
        breakpoints
      );

    case 'font-family':
    case 'line-height':
    case 'font-weight':
    case 'letter-spacing':
    case 'color':
    case 'background-color':
    case 'border':
    case 'border-top':
    case 'border-bottom':
    case 'border-left':
    case 'border-right':
    case 'border-width':
    case 'border-style':
    case 'border-color':
    case 'border-radius':
    case 'display':
    case 'position':
    case 'z-index':
    case 'top':
    case 'bottom':
    case 'left':
    case 'right':
    case 'align-items':
    case 'align-content':
    case 'justify-content':
    case 'flex-wrap':
    case 'flex-direction':
      return setCustomProperty(namespace, componentName, props, propName);
  }
}

export function setup(
  propList: string[],
  componentName: string,
  props: IComponentProps,
  namespace: string = 'sui',
  breakpoints: string[] = ['mobile', 'tablet', 'desktop']
) {
  propList.forEach(propName =>
    createProp(propName, componentName, props, namespace, breakpoints)
  );
}
