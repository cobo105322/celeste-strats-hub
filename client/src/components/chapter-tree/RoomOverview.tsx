import React from 'react';
import {Room} from '../../generated';
import './RoomOverview.css';

interface Props {
  room: Room;
  onClick: (code: string) => void;
}

export function RoomOverview({room, onClick}: Props) {
  return (
      <div className="room-box" onClick={() => onClick(room.code)}>
        <img className="room-thumbnail" src={'assets/' + room.image}></img>
        {room.code}
      </div>
  );
}