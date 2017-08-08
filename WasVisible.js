import _ from "underscore";
import React from "react";
import ReactDOM from "react-dom";

const isElementInViewport = function(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.bottom >= 0 &&
    rect.right >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// This HOC exposes a boolean prop, wasVisible.
// wasVisible indicates if it has every been in the viewport, which
// can be used for lazy loading.
export default (WasVisible = function(Component) {
  class WasVisible extends React.Component {
    state = {
      wasVisible: false,
      isPrint: false,
      detached: false
    };

    componentWillMount() {
      this._handleScroll = _.throttle(this._handleScroll, 200);
      window.addEventListener("scroll", this._handleScroll);
      return this.media.addListener(this._handlePrint);
    }

    componentDidMount() {
      return this._handleScroll();
    }

    componentWillUnmount() {
      if (!this.state.detached) {
        window.removeEventListener("scroll", this._handleScroll);
      }
      return this.media.removeListener(this._handlePrint);
    }

    _handlePrint({ matches }) {
      if (matches !== this.state.isPrint) {
        this.setState({ isPrint: matches });
        return this._handleScroll();
      }
    }

    _handleScroll() {
      const isVisible = isElementInViewport(ReactDOM.findDOMNode(this));

      if ((this.state.isPrint || isVisible) && !this.state.wasVisible) {
        window.removeEventListener("scroll", this._handleScroll);
        return this.setState({ wasVisible: true, detached: true });
      }
    }

    render() {
      return (
        <Component
          ref={n => (this.wrapper = n)}
          {...this.props}
          {...this.state}
        />
      );
    }
  }
});
