import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import Section from './Section.jsx';
import NotesHeader from './NotesHeader.jsx';

export default class NotesContainer extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const {sections, userId, addSection, editSection, selectSection, releaseSectionLock} = this.props;
    return (
      <div id="notes-container">
        <NotesHeader />

        <div className="notes-data-wrapper">
          {sections.map(section => {
            return (
              <Section
                key={section._id}
                section={section}
                userId={userId}
                addSection={addSection}
                editSection={editSection}
                selectSection={selectSection}
                releaseSectionLock={releaseSectionLock}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
NotesContainer.defaultProps = {
  sections: []
};
