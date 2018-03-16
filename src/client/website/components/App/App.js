import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';
import { BrowserRouter } from 'react-router-dom';
import Header from './../../containers/App/Header';
import Footer from './../../containers/App/Footer';
import ModeratorPanel from './../../containers/Retro/ModeratorPanel';


class App extends Component{

  onDragEnd = (result, provided) => {
    const { socket } = this.context;
    const { editCard } = this.props;
    const id = result.draggableId;
    if (!result.destination){
      return
    }
    const columnId = result.destination.droppableId;
    editCard(socket, { id, columnId });
  };

  render(){
    const {  
      children,
      headerChildren,
      dialogChildren,
      classes
    } = this.props;
    return (
      <BrowserRouter>
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
          >
          <div className={classes.app}>
            <Header>
              {headerChildren}
            </Header>
            <section className={classes.content}>{children}</section>
            <Footer />
            <ModeratorPanel />
            { dialogChildren }
          </div>
        </DragDropContext>
      </ BrowserRouter>
    );
  }
}

App.propTypes = {
  classes: PropTypes.shape({
    app: PropTypes.string.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired,
  headerChildren: PropTypes.node,
  dialogChildren: PropTypes.node
};

App.contextTypes = {
  socket: PropTypes.object.isRequired
};

export default App;