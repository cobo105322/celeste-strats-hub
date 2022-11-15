import React, {useEffect, useState} from 'react';
import {Chapter, Checkpoint, DefaultApi, DefaultApiInterface, Room} from '../../generated';
import {Strats} from '../strats/Strats';
import {ChapterSelect} from './ChapterSelect';
import {CheckpointSelect} from './CheckpointSelect';
import {RoomSelect} from './RoomSelect';

export function ChapterTree() {
  const api: DefaultApiInterface = new DefaultApi();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>();
  const [selectedRoom, setSelectedRoom] = useState<string>();

  useEffect(() => {
    api.getChapters().then(setChapters);
  }, []);

  useEffect(() => {
    setSelectedRoom('');
    setSelectedCheckpoint('');
    if (selectedChapter) {
      api.getCheckpoints({chapter: selectedChapter}).then(setCheckpoints);
    } else {
      setCheckpoints([]);
    }
  }, [selectedChapter]);

  useEffect(() => {
    setSelectedRoom('');
    if (selectedCheckpoint) {
      api.getRooms({checkpoint: selectedCheckpoint}).then((res) => {
        console.log(res);
        setRooms(res);
      });
    } else {
      setRooms([]);
    }
  }, [selectedCheckpoint]);

  return (
      <div>
        <ChapterSelect chapters={chapters} onChapterSelect={setSelectedChapter}></ChapterSelect>
        <br/>
        <CheckpointSelect checkpoints={checkpoints} onCheckpointSelect={setSelectedCheckpoint}></CheckpointSelect>
        <br/>
        <RoomSelect rooms={rooms} onRoomSelect={setSelectedRoom}></RoomSelect>
        <br/>
        <Strats chapter={selectedChapter} room={selectedRoom}></Strats>
      </div>
  );
}
