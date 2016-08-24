import React, { PureComponent, PropTypes } from 'react';

import Year from './Year';

/**
 * The `YearPicker` component is the Year view in a `DatePicker`. This
 * will display a list of years to select from within the given range.
 */
export default class YearPicker extends PureComponent {
  static propTypes = {
    calendarTempDate: PropTypes.instanceOf(Date).isRequired,
    onCalendarYearClick: PropTypes.func.isRequired,
    initialYearsDisplayed: PropTypes.number.isRequired,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date),
  };

  constructor(props) {
    super(props);

    const year = props.calendarTempDate.getFullYear();
    const range = !props.minDate && !props.maxDate
      ? parseInt(props.initialYearsDisplayed / 2, 10)
      : props.initialYearsDisplayed;

    let startYear;
    let endYear;
    if (props.minDate && props.maxDate) {
      startYear = props.minDate.getFullYear();
      endYear = props.maxDate.getFullYear();
    } else if (!props.minDate && !props.maxDate) {
      startYear = year - range;
      endYear = year + range;
      if (props.initialYearsDisplayed % 2 === 0) {
        endYear -= 1;
      }
    } else if (!props.maxDate) {
      startYear = props.minDate.getFullYear();
      endYear = startYear + props.initialYearsDisplayed - 1;
    } else {
      endYear = props.maxDate.getFullYear();
      startYear = endYear - props.initialYearsDisplayed + 1;
    }

    this.state = { startYear, endYear };
  }

  componentDidMount() {
    const { container } = this.refs;
    const active = container.querySelector('.md-year.active');

    // Position the active year in the center of the picker
    let scrollTop = active.offsetTop - (container.offsetHeight * 1.5);
    if (container.offsetHeight < container.offsetWidth) {
      // Landscape is off by a bit for some reason
      scrollTop -= (active.offsetHeight / 2);
    }

    container.scrollTop = scrollTop;
  }

  render() {
    const { startYear, endYear } = this.state;

    const currentYear = this.props.calendarTempDate.getFullYear();
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(
        <Year
          key={year}
          year={year}
          active={year === currentYear}
          onClick={this.props.onCalendarYearClick}
        />
      );
    }
    return (
      <section className="md-picker-content md-year-picker" ref="container">
        <ol className="md-years">
          {years}
        </ol>
      </section>
    );
  }
}
