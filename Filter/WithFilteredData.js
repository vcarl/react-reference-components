// @flow
import React from "react";
import PropTypes from "prop-types";

type VoidFunc = () => void;
type Predicate = mixed => boolean;

const WithFilteredData = (Component: ReactClass<*>) =>
  class WithFilter extends React.Component {
    static contextTypes = {
      subscribe: PropTypes.func
    };
    props: {
      children: (Array<any>) => Element,
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
      const { data, ...rest } = this.props;

      let filtered = data.filter(this.predicate);
      return <Component data={filtered} {...rest} />;
    }
  };

export default WithFilteredData;
