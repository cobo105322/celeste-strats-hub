import React from 'react';
import {Room} from '../../generated';
import {RoomOverview} from './RoomOverview';
import './RoomSelect.css';

interface Props {
  rooms: Room[];
  onRoomSelect: (room: string) => void;
}

export function RoomSelect({rooms, onRoomSelect}: Props) {
  return <div className="room-group">
    {rooms.map(room => <RoomOverview room={room} key={room.code} onClick={onRoomSelect}></RoomOverview>)}
  </div>
}
