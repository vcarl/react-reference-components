import React from 'react';
import _ from 'ramda';

export default class AutoComplete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedIndex: 0,
      filter: null,
      filteredOptions: this.props.options,
      showNew: false
    };
    this.clear = this.clear.bind(this);
    this.open = this.open.bind(this);
    this.create = this.create.bind(this);
    this.select = this.select.bind(this);
    this.handleInputClick = this.handleInputClick.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.selectEmpty = this.selectEmpty.bind(this);
    this.textChange = this.textChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
    this.downPressed = this.downPressed.bind(this);
    this.upPressed = this.upPressed.bind(this);
    this.filter = this.filter.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.isNewOptionShown = this.isNewOptionShown.bind(this);
    this.renderOption = this.renderOption.bind(this);
    this.renderList = this.renderList.bind(this);
    this.renderCreateOption = this.renderCreateOption.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({filter: null})
    }
  }
  clear() {
    if (this.state.filter === '') this.selectEmpty()

    this.setState({
      open: false,
      filter: null,
      filteredOptions: this.props.options
    });
    if (this.refs.scroller) this.refs.scroller.scrollTop = 0;
  }

  open() {
    this.setState({
      open: true,
      selectedIndex: _.findIndex((val) => val.name === this.props.value, this.props.options)
    })
  }

  create(name) {
    this.props.onCreate(name)
    this.clear()
  }

  select(value) {
    this.props.onSelect(value)
    // If the filter is empty, null it so clear() doesn't select empty.
    if (this.state.filter === ''){
      this.setState({filter: null}, this.clear)
    } else {
      this.clear()
    }
  }

  // When the text input is clicked, highlight all text.
  handleInputClick(event) {
    event.stopPropagation()
    this.refs.autocompleteInput.select()
  }

  handleOptionClick(option) {
    return function(event) {
      event.stopPropagation();
      this.select(option);
    }.bind(this)
  }

  handleCreateClick() {
    this.create(this.state.filter);
  }

  selectEmpty() {
    this.props.onSelect('')
  }

  textChange(event) {
    event.stopPropagation()
    this.filter(event.target.value)
  }

  handleKeyDown(event) {
    if (!this.state.filter && !this.state.open) {
      this.open();
    }
    switch (event.keyCode) {
      // Up arrow
      case 38: 
        this.upPressed(event);
        break;
      // Down arrow
      case 40: 
        this.downPressed(event);
        break;
      // Enter
      case 13: 
        this.enterPressed(event);
        break;
      // Esc, tab
      case 27:
      case 9:
        this.clear();
        break;
    }
  }

  enterPressed(event) {
    if (this.state.open) {
      event.preventDefault()
      // If the selected index is the length of the options array, we're at the
      // 'create new' option.
      // If the value highlighted via keyboard is in the list of filtered options
      // when enter is pressed, select it.
      let index = this.state.selectedIndex;
      let selected = this.state.filteredOptions[index];
      if (index === this.state.filteredOptions.length && this.state.filter) {
        this.create(this.state.filter);
      } else if (this.state.filteredOptions.indexOf(selected) !== -1) {
        this.select(selected);
      }
    }
  }

  downPressed(event) {
    if (this.state.open) {
      let optionCount = this.state.filteredOptions.length
      event.preventDefault()
      if (
        this.state.selectedIndex < optionCount - 1 ||
        this.state.selectedIndex === optionCount - 1 &&
        this.isNewOptionShown()
      ) {
        let newIndex = this.state.selectedIndex + 1;
        let nextNode = this.refs['option' + newIndex];

        this.setState({selectedIndex: newIndex})
      }
    } else this.open();
  }

  upPressed(event) {
    if (this.state.open) {
      event.preventDefault();
      if (this.state.selectedIndex > 0) {
        let newIndex = this.state.selectedIndex - 1;
        let nextNode = this.refs['option' + newIndex];

        this.setState({selectedIndex: newIndex});
      }
    } else this.open();
  }

  // Filter the results. Perform a lower case comparison between each option
  // and the filter text. If there's an exact match, hide the user input option.
  filter(filter) {
    let lower = filter.toLowerCase();
    let exact = false;
    let regex = new RegExp(lower.split('').join('.*'));
    let options = _.filter(function(option) {
      name = option.name.toLowerCase()
      exact = exact || name === lower
      return regex.test(name)
    }, this.props.options)
    // Only show the option to add a new entry if there isn't an exact match.
    let showNew = !exact;

    this.setState({
      filter: filter,
      filteredOptions: options,
      selectedIndex: (filter === '')? -1: 0,
      open: true,
      showNew: showNew
    });
  }

  // Check if an option is the currently selected one.
  isSelected(option) {
    if (_.isArrayLike(this.props.value)) {
      return this.props.value.indexOf(option) !== -1
    }

    return option === this.props.value
  }

  isNewOptionShown() {
    return !!(this.state.filter && this.state.showNew && this.props.onCreate)
  }

  // Return an element for each list item.
  renderOption(value, index) {
    let className = 'result'
    if (this.isSelected(value)) {
      className += ' selected'
    }
    if (value === this.state.filteredOptions[this.state.selectedIndex]) {
      className += ' highlighted'
    }

    return <li
      key={value.id}
      onMouseDown={this.handleOptionClick(value)}
      className={className}
      ref={`option${index}`}
    >
      {value.name}
    </li>
  }

  // Return an element for the user input list item.
  renderCreateOption() {
    let className = 'result add-new';
    if (this.state.selectedIndex === this.state.filteredOptions.length) {
      className += ' highlighted';
    }

    return <li
        key='new'
        className={className}
        onMouseDown={this.handleCreateClick}
        ref={'option' + this.state.filteredOptions.length}
      >
        {`+ "${this.state.filter || ' '}"`}
      </li>
    }

  renderList() {
    let showNew = this.isNewOptionShown()
    if (this.state.filteredOptions.length === 0 && !showNew) {
      return null
    } else {
      let list= _.map(this.renderOption, this.state.filteredOptions);
      if (showNew) {
        list.push(this.renderCreateOption())
      }

      return <div className={`results ${!this.state.open? 'hide': ''}`}>
        <ul
          ref='scroller'
          className="result-list"
        >
          {list}
        </ul>
      </div>
    }
  }

  render() {
    // Some weird logic is needed to get the right value to display. state.filter
    // can be null or a string, including emptystring; if it's null, we're not
    // filtering and thus want to show the currently selected value. If it's
    // any string, we want to show that string.
    let value = (this.state.filter == null) ? this.props.value : this.state.filter;

    return <div className="fl-autocomplete" style={{position: 'relative'}}>
      <input
        ref="autocompleteInput"
        name={this.props.name}
        type="text"
        value={value}
        className={this.props.className}
        onChange={this.textChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.clear}
        onClick={this.handleInputClick}
        placeholder={this.props.placeholder}
        autoComplete="off"
      />
      {this.renderList()}
    </div>
  }
}

AutoComplete.propTypes = {
  className: React.PropTypes.string,
  name: React.PropTypes.string,
  onCreate: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  options: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.any,
      name: React.PropTypes.string
    })
  ).isRequired,
  placeholder: React.PropTypes.string,
  value: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string
  ])
};

AutoComplete.defaultProps = {
  name: 'autocomplete-input',
  value: '',
  className: '',
  onCreate: false,
  onSelect: function() {}
}
