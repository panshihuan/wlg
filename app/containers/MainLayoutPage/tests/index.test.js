import React from 'react';
import { shallow } from 'enzyme';

import MainLayoutPage from '../index';

describe('<MainLayoutPage />', () => {
  it('should render its children', () => {
    const children = (<h1>Test</h1>);
    const renderedComponent = shallow(
      <MainLayoutPage>
        {children}
      </MainLayoutPage>
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});
