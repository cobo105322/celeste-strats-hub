import {Card, CardContent, CardHeader, Link} from '@mui/material';
import React, {Fragment} from 'react';
import {Room} from '../../generated';
import {Strats} from '../strats/Strats';

interface Props {
  chapter?: string;
  room?: Room;
  onConnectedRoomSelected: (roomCode: string) => void;
}

export function RoomDetails({chapter, room, onConnectedRoomSelected}: Props) {
  return (
      room && <>
        <Card>
          <CardHeader title="Room Details"></CardHeader>
          <CardContent>
            <img className="room-thumbnail" src={'assets/' + room.image}></img>
          <div>
            <table>
              <tbody>
              <tr>
                <td>Room Code:</td>
                <td>{room.code}</td>
              </tr>
              <tr>
                <td>Connected Rooms:</td>
                <td>{room.connected.map((connection, index) =>
                    <Fragment key={connection}>
                      {index > 0 && ', '}
                      <Link onClick={() => onConnectedRoomSelected(connection)}>
                        {connection}
                      </Link>
                    </Fragment>)
                }</td>
              </tr>
              </tbody>
            </table>
          </div>
          </CardContent>
        </Card>
        <Strats chapter={chapter} room={room.code}></Strats>
      </> || <></>
  );
}