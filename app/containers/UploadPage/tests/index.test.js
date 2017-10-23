import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shallow } from 'enzyme';

import ExcelPage from '../index';
import messages from '../messages';

describe('<UploadPage />', () => {
  it('should render the Page message', () => {
    const renderedComponent = shallow(
      <ExcelPage />
    );
    expect(renderedComponent.contains(
      <FormattedMessage {...messages.header} />
    )).toEqual(true);
  });
});
