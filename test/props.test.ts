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
const baseComponent: IMockProps = {
  el: {
    style: {
      cssText: '',
      // Mocks the DOM's method for applying CSS properties to element
      setProperty: function(name: string, value: any) {
        this.cssText = `${this.cssText} ${name}: ${value}`;
      },
    },
  },
};

describe('Width Prop', () => {
  it('100% width', () => {
    const mockComponent = {
      ...baseComponent,
      width: '100%',
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp('--sui-component-width: 100%')
    );
  });

  it('0.5 width', () => {
    const mockComponent = {
      ...baseComponent,
      width: 0.5,
    };

    setup(['width'], 'component', mockComponent);
    expect(mockComponent.el.style.cssText).toMatch(
      new RegExp('--sui-component-width: 50%')
    );
  });
});
