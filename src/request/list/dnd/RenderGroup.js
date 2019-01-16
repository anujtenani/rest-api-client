import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Draggable, Droppable} from "react-beautiful-dnd";
import RequestListItem from "../RequestListItem";
import {withRouter} from "react-router-dom";
const grid = 1;

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
});

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

class RenderGroup extends Component {
    render() {
        const {groupId, requests, groupTitle} = this.props;
        console.log(requests);
        return (
            <Droppable droppableId={groupId}>
                {(provided, snapshot) => (
                    <div className={"p-2 bg-orange"} ref={provided.innerRef}>
                        <h2>{groupTitle}</h2>
                        {requests.map((request, index)=>{
                            const { projectId } = this.props;
                            const {name, method, type, requestId } = request;
                            const path = `/p/${projectId}/${type || 'request'}/${requestId}`;
                            const isActive = this.props.location.pathname === path;

                            return <Draggable key={requestId} draggableId={requestId} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}>
                                        <RequestListItem
                                            requestId={requestId}
                                            key={requestId}
                                            name={name}
                                            method={method}
                                            type={type}
                                            path={path}
                                            //this is a performance optimization so that RequestListItem is only rendered if location change affects it
                                            isActive={isActive}
                                        />
                                    </div>
                                )}

                            </Draggable>
                        })}
                        {provided.placeholder}
                    </div>
                )}

            </Droppable>
        );
    }
}

function mapStateToProps(state, props) {
    return {
        requests: props.requests.map((requestId)=>{
            console.log(state.requests.byId[requestId]);
            const {title, name, method, type} = state.requests.byId[requestId];
            return {name:title || name, method, type, requestId}
        }),
        projectId: state.metadata.id
      //  groupId:"12adsad",
      //  groupTitle:"asdasd",
      //  requests:[""]
    };
}

export default withRouter(connect(
    mapStateToProps,
)(RenderGroup));
