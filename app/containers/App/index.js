/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import withSizes from 'react-sizes';
import {Table} from 'antd'
class App extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <div style={{height: '100%'}}>  {false && <Table></Table>}{React.Children.toArray(this.props.children)}</div>
    )
      ;
  }
}

const mapSizesToProps = ({width, height}) => ({
  height: height
});

export default withSizes(mapSizesToProps)(App);
