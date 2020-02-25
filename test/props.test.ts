import { IUtilityProps, setup } from '../src';

export interface IMockProps extends IUtilityProps {
  /**
   * Usually refs to component in DOM to access style object via ElementCSSInlineStyle.style
   * But we do any here to allow for a mocked version
   */
  el: any;

  [key: string]: any;
}

/**
 * Mock component to use in testing
 * mimics the DOM's native behavior of setting CSS properties
 */
const baseComponent = (): IMockProps => ({
  el: {
    style: {
      cssText: '',
      // Mocks the DOM's method for applying CSS properties to element
      setProperty: function(name: string, value: any) {
        this.cssText = `${this.cssText} ${name}: ${value}`;
      },
    },
  },
});

describe('Width Prop', () => {
  it('100% width', () => {
    const mockComponent = {
      ...baseComponent(),
      width: '100%',
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp('--sui-component-width: 100%')
    );
  });

  it('0.5 width', () => {
    const mockComponent = {
      ...baseComponent(),
      width: 0.5,
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp('--sui-component-width: 50%')
    );
  });

  it('Responsive number width', () => {
    const mockComponent = {
      ...baseComponent(),
      width: [1, 0.5, 0.3],
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp(
        '--sui-component-width-mobile: 100% --sui-component-width: 100% --sui-component-width-tablet: 50% --sui-component-width-desktop: 30%'
      )
    );
  });

  it('Responsive string width', () => {
    const mockComponent = {
      ...baseComponent(),
      width: ['100%', '50%', '30%'],
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp(
        '--sui-component-width-mobile: 100% --sui-component-width: 100% --sui-component-width-tablet: 50% --sui-component-width-desktop: 30%'
      )
    );
  });
});

describe('Color Prop', () => {
  it('Color string (theme property)', () => {
    const mockComponent = {
      ...baseComponent(),
      color: 'red',
    };

    setup(['color'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-color: var(--sui-colors-red)'
    );
  });

  it('Hex code', () => {
    const mockComponent = {
      ...baseComponent(),
      color: '#000',
    };

    setup(['color'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp('--sui-component-color: #000')
    );
  });

  it('RGBA code', () => {
    const mockComponent = {
      ...baseComponent(),
      color: 'rgba(0,0,0,0.5)',
    };

    setup(['color'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-color: rgba(0,0,0,0.5)'
    );
  });
});

describe('Padding Prop', () => {
  it('Number (theme property)', () => {
    const mockComponent = {
      ...baseComponent(),
      p: 1,
    };

    setup(['padding'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-padding: var(--sui-spacing-1)'
    );
  });

  it('String using px', () => {
    const mockComponent = {
      ...baseComponent(),
      p: '100px',
    };

    setup(['padding'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-padding: 100px'
    );
  });

  it('Responsive padding - numbers', () => {
    const mockComponent = {
      ...baseComponent(),
      p: [1, 2, 3],
    };

    setup(['padding'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-padding-mobile: var(--sui-spacing-1) --sui-component-padding: var(--sui-spacing-1) --sui-component-padding-tablet: var(--sui-spacing-2) --sui-component-padding-desktop: var(--sui-spacing-3)'
    );
  });

  it('Responsive padding - strings', () => {
    const mockComponent = {
      ...baseComponent(),
      p: ['4px', '8px', '16px'],
    };

    setup(['padding'], 'component', mockComponent);
    console.log('padding', mockComponent.el.style.cssText);
    expect(mockComponent.el.style.cssText).toEqual(
      ' --sui-component-padding-mobile: 4px --sui-component-padding: 4px --sui-component-padding-tablet: 8px --sui-component-padding-desktop: 16px'
    );
  });
});
