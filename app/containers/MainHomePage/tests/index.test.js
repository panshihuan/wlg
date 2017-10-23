import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import MainHomePage from '../index';
import messages from '../messages';

describe('<MainHomePage />', () => {
  it('should render the Page message', () => {
    const renderedComponent = shallow(
      <MainHomePage />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
