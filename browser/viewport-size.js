/**
Helpful when you need to alter behavior, markup, etc based on viewport size.
This component checks the viewport size and exposes it as a property to a
wrapped component.
This should be used sparingly; if you're just changing appearance, it can 
probably be done with CSS media queries. Running javascript and rendering
React components will always be slower than applying different styles. This
higher order component has been useful to me when drastic visual changes on
mobile (e.g. a sidebar that turns into a collapsable panel).
One limitation of this implementation: to keep this example self contained,
viewport sizes are defined in the javascript, which violates DRY by requiring
sizes to be synchronized between media queries and here. When I used this in
production, I used our grid generation logic (in Less) to add the size (xs, sm,
etc) as an invisible `content` style on `body:after`, which was retrieved in
the resize listener here. 
*/

import React from 'react';
import { reduce, debounce } from 'lodash';

// Minimum widths for each window size.
const WINDOW_SIZES = [
  ['xs', 0],
  ['sm', 500],
  ['md', 800],
  ['lg', 1100],
  ['xl', 1600]
];

function calculateWindowSize(width) {
  function reduceSize(compare, sizePair) {
    if (sizePair[1] < width) return sizePair[0];
    return compare;
  }

  // Returns the largest window size that's < inner width.
  return reduce(WINDOW_SIZES, reduceSize, 'xl')
}

export default function (Component) {
  return class ViewportSize extends React.Component {
    constructor(props, context) {
      super(props, context);

      // Debounce so it's not called *too* excessively.
      this.handleResize = debounce(this.handleResize).bind(this);
      window.addEventListener('resize', this.handleResize);

      this.state = {
        viewportSize: calculateWindowSize(window.innerWidth)
      }
    }
    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize)
    }
    handleResize() {
      const newViewportSize = calculateWindowSize(window.innerWidth);
      // Only set state
      if (this.state.viewportSize !== newViewportSize) {
        this.setState({ viewportSize: newViewportSize });
      }
    }
    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
        />
      )
    }
  }
}
