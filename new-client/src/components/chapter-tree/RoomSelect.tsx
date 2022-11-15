import React from 'react';
import {IRoom} from '../../service/data-interface';

interface Props {
  rooms: IRoom[];
}

export function RoomSelect({rooms}: Props) {
  return <>{rooms}</>
}
