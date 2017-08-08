// @flow
import React from "react";
import PropTypes from "prop-types";

import { Control } from "./filter.types";

type VoidFunc = () => void;

const isActive = value => value !== "";

export default class Search extends React.Component {
  static contextTypes = {
    registerControl: PropTypes.func
  };
  props: {
    name: string
  };
  state = {
    value: ""
  };
  updateFilter: VoidFunc = () => {};
  unregisterControl: VoidFunc = () => {};

  componentDidMount() {
    let { unregister, update } = this.context.registerControl(this.control);
    this.updateFilter = update;
    this.unregisterControl = unregister;
  }
  componentWillUnmount() {
    this.unregisterControl();
  }
  control: Control = () => {
    if (isActive(this.state.value)) {
      return [this.props.name, `?${this.state.value}`];
    }
    return undefined;
  };
  handleChange = (e: SyntheticInputEvent) => {
    let value = e.target.value;
    this.setState({ value }, this.updateFilter);
  };
  render() {
    return (
      <input
        value={this.state.value}
        onChange={this.handleChange}
        {...this.props}
      />
    );
  }
}
