import React from 'react';

export default class TodoInput extends React.Component {
  getStyles() {
    return {
      input: {
        // layout
        width: '100%',
        padding: '8px 8px 8px 60px',
        border: 'none',
        outline: 'none',
        boxShadow: 'inset 0 -2px 1px rgba(0,0,0,0.03)',
        boxSizing: 'border-box',
        // typography
        fontSize: '14px',
        lineHeight: '1.4em',
      }
    };
  }

  setFocus() {
    this._input.focus();
  }

  handleKeyDown(e) {
    const {addTask} = this.props;
    const input = this._input.value;
    if (e.keyCode === 13 && input.trim() !== '') {
      addTask(input.trim());
      this._input.value = '';
    }
  }

  render() {
    const styles = this.getStyles();
    return (
      <header>
        <input
          style={styles.input}
          placeholder="What needs to be done?"
          onKeyDown={this.handleKeyDown.bind(this)}
          ref={x => this._input = x}
        />
      </header>
    );
  }
}
