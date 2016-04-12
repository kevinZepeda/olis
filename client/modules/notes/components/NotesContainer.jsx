import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import NotesHeader from './NotesHeader.jsx';
import DraggableWidget from '/client/modules/widgets/draggableWidget/components/DraggableWidget.jsx';
import Widget from '/client/modules/widgets/widget/containers/widget';

class NotesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderWidgets() {
    const {
      userId, note, widgets,
      addWidget, removeWidget, moveWidget
    } = this.props;

    return widgets.map((widget, index) => {
      return (
        <DraggableWidget
          key={widget._id}
          index={index}
          noteId={note._id}
          widgetId={widget._id}
          moveWidget={moveWidget}
        >
          <Widget widget={widget} removeWidget={removeWidget} />
        </DraggableWidget>
      );
    });
  }

  render() {
    return (
      <div id="notes-container">
        <NotesHeader />
        <div className="notes-data-wrapper">
          {this.renderWidgets()}
        </div>
      </div>
    );
  }
}
NotesContainer.defaultProps = {
  widgets: []
};

export default DragDropContext(HTML5Backend)(NotesContainer);
