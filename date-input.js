import React from 'react'
import DatePicker from 'react-date-picker'
import FA from 'react-fontawesome'
import PageClick from 'components/page-click'

export default class DateInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.openDatepicker = this.openDatepicker.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }
  handleChange(date) {
    this.props.onChange(date)
  }
  openDatepicker(e) {
    e.preventDefault();
    this.setState({ open: !this.state.open })
  }
  handlePageClick(e) {
    this.setState({ open: false })
  }
  render() {
    let picker = null;

    if (this.state.open) {
      picker = (<DatePicker
        style={{
          position: 'absolute',
          width: 250,
          height: 300,
          zIndex: 1000
        }}
        className="card shadow"
        date={this.props.value}
        onChange={this.handleChange}
      />)
    }
    return (
      <div className={this.props.className}>
        <button
          onClick={this.openDatepicker}
          className="btn btn-primary"
        >
          <FA name="calendar" />
        </button>
        <PageClick onClick={this.handlePageClick}>
          <div>{ picker }</div>
        </PageClick>
      </div>
    )
  }
}

DateInput.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  className: React.PropTypes.string
}

DateInput.defaultProps = {
  className: ''
}
