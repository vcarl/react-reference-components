// @flow
import React from "react";
import PropTypes from "prop-types";

type VoidFunc = () => void;
type Predicate = mixed => boolean;

export default class Filter extends React.Component {
  static contextTypes = {
    subscribe: PropTypes.func
  };
  props: {
    children: Array<any> => Element,
    data: Array<mixed>
  };
  unsubscribe: VoidFunc = () => {};
  predicate: Predicate = () => true;

  componentDidMount() {
    this.unsubscribe = this.context.subscribe(this.updateFilter);
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  updateFilter = (predicate: Predicate) => {
    this.predicate = predicate;
    this.forceUpdate();
  };
  render() {
    let filtered = this.props.data.filter(this.predicate);
    return (
      <div>
        {this.props.children(filtered)}
      </div>
    );
  }
}
