import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import SearchIcon from "./components/icons/SearchIcon";
import Mehmoji from "./components/icons/Mehmoji";
import ChannelItem from "./components/ChannelItem";

// Import toast library
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { channelData, iconList } from "./data/appData";

const App = () => {
  const [channels, updateChannels] = useState(channelData);
  const [channelsClone, updateChannelsClone] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [actionTookPlace, setActionTookPlace] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const notify = (msg) => toast(msg);

  // Save list data when a drag is detected
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(channels);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateChannelsClone(channels);
    updateChannels(items);
    setShowConfirmation(true);
    setActionTookPlace(true);
  }

  // Handle search input and filter through list data
  const updateSearchTerm = (evt) => {
    setSearchTerm((prev) => evt.target.value);
    let newChannelsList = channelsClone.filter((channel) =>
      channel.name.toLowerCase().includes(evt.target.value.toLowerCase())
    );
    if (!channelsClone.length) updateChannelsClone(channels);
    updateChannels((prev) => [...newChannelsList]);
    setShowConfirmation(true);

    if (evt.target.value === "") setShowConfirmation(false);
  };

  // Create a new channel when the searchTerm does not have any matches
  const createChannel = (name, e) => {
    if (e.target.value.trim() === "") return;
    if (!channels.length)
      if (e.keyCode === 13) {
        let channel = {
          id: channelsClone.length + 1,
          name: name,
          iconType: "regular",
          icon: iconList[Math.floor(Math.random() * iconList.length)],
        };

        let newChannelList = [...channelsClone, channel];
        updateChannels(newChannelList);
        setSearchTerm("");
        console.log(channels);
      }
  };

  // Removes an item from the list by it's ID
  const removeItem = (id) => {
    let newChannelsList = channels.filter((channel) => channel.id !== id);
    if (!channelsClone.length) updateChannelsClone(channels);
    updateChannels(newChannelsList);
    setShowConfirmation(true);
    setActionTookPlace(true);
  };

  // Rejects/reverses an action
  const denyAction = () => {
    updateChannels(channelsClone);
    updateChannelsClone([]);
    setShowConfirmation(false);
    setTimeout(() => {
      alert("The action was reverted. No Changes were made.");
      notify("The action was reverted. No Changes were made.");
    }, 1000);
  };

  // Confirms an action
  const applyAction = () => {
    setShowConfirmation(false);
    localStorage.setItem("channelList", JSON.stringify(channels));
    setTimeout(() => {
      alert("An action took place. Changes have been saved to localStorage.");
      notify("An action took place. Changes have been saved to localStorage.");
    }, 1000);
  };

  // Creating a copy of the data to localStorage
  useEffect(() => {
    if (!localStorage.getItem("channelList"))
      localStorage.setItem("channelList", JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    if (localStorage.getItem("channelList"))
      updateChannels(JSON.parse(localStorage.getItem("channelList")));
  }, []);

  return (
    <div className="App">
      <div className="card">
        {/* Start Search */}
        <div className="search-area">
          <form onSubmit={(e) => e.preventDefault()}>
            <SearchIcon />
            <input
              onChange={updateSearchTerm}
              onKeyDown={(e) => createChannel(searchTerm, e)}
              type="text"
              placeholder="Find or Add a Channel..."
              autoFocus
              value={searchTerm}
            />
          </form>
        </div>
        {/* End search area */}
        {/* Start Channel list */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="channels">
            {(provided) => (
              <div
                className="list-container"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {channels.length ? (
                  channels.map((item, index) => {
                    return (
                      <Draggable
                        key={item.id.toString()}
                        draggableId={item.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <ChannelItem
                            provided={provided}
                            item={item}
                            removeItem={removeItem}
                          />
                        )}
                      </Draggable>
                    );
                  })
                ) : (
                  <div className="no-items">
                    <Mehmoji />
                    <p>There are no channels left. Type to add a channel</p>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {/* End Channels List */}
        {/* Start Actions */}
        <div
          className="actions-container"
          style={{ display: showConfirmation ? "flex" : "none" }}
        >
          <button id="cancel" onClick={denyAction}>
            Cancel
          </button>
          <button id="apply" onClick={applyAction} disabled={!actionTookPlace}>
            Apply
          </button>
        </div>
        {/* End Actions */}
      </div>
      <ToastContainer />
    </div>
  );
};
export default App;
