import React from "react";

const ChannelItem = ({ provided, item, removeItem }) => {
  return (
    <div
      className="item"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div className="item-info">
        <div className="handle">
          <i className="fas fa-grip-vertical"></i>
        </div>
        <div className="icon">
          <i
            className={"fa" + item.iconType.slice(0, 1) + " fa-" + item.icon}
          ></i>
        </div>
        <p>{item.name}</p>
      </div>
      <div className="item-action" onClick={(evt) => removeItem(item.id)}>
        <span>Remove</span>
        <span>
          <i className="fa fa-times"></i>
        </span>
      </div>
    </div>
  );
};

export default ChannelItem;
