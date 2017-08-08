import React from "react";
import DatePicker from "react-date-picker";
import FA from "react-fontawesome";
import PageClick from "components/page-click";

export default class DateInput extends React.Component {
  state = {
    open: false
  };

  handleChange = date => {
    this.props.onChange(date);
  };
  ToggleDatepicker = e => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  };
  closeDatepicker = e => {
    this.setState({ open: false });
  };
  render() {
    let picker = null;

    if (this.state.open) {
      picker = (
        <DatePicker
          style={{
            position: "absolute",
            width: 250,
            height: 300,
            zIndex: 1000
          }}
          className="card shadow"
          date={this.props.value}
          onChange={this.handleChange}
        />
      );
    }
    return (
      <div className={this.props.className}>
        <button onClick={this.toggleDatepicker} className="btn btn-primary">
          <FA name="calendar" />
        </button>
        <PageClick onClick={this.closeDatepicker}>
          <div>
            {picker}
          </div>
        </PageClick>
      </div>
    );
  }
}

DateInput.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
};

DateInput.defaultProps = {
  className: ""
};
