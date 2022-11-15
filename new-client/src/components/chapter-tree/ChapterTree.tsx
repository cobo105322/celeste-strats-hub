import React, {useEffect, useState} from 'react';
import {IChapter, ICheckpoint, IRoom} from '../../service/data-interface';
import {Api, HttpApi} from '../../service/http-api';
import {Strats} from '../strats/Strats';
import {ChapterSelect} from './ChapterSelect';
import {CheckpointSelect} from './CheckpointSelect';
import {RoomSelect} from './RoomSelect';

export function ChapterTree() {
  const serverUrl = process.env.REACT_APP_API_URL ?? '';
  const api: Api = new HttpApi(serverUrl);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [checkpoints, setCheckpoints] = useState<ICheckpoint[]>([]);
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>();
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string>();

  useEffect(() => {
    api.apiGet<IChapter[]>('chapters', {}).then(setChapters);
  }, []);

  const selectChapter = (chapter: string) => {
    setSelectedChapter(chapter);
    api.apiGet<ICheckpoint[]>('checkpoints', {
      chapter: chapter,
    }).then(setCheckpoints);
  };

  const selectCheckpoint = (checkpoint: string) => {
    setSelectedCheckpoint(checkpoint);
    api.apiGet<IRoom[]>('rooms', {
      checkpoint: checkpoint,
    }).then(setRooms);
  };

  return (
      <div>
        <ChapterSelect chapters={chapters} onChapterSelect={selectChapter}></ChapterSelect>
        <br/>
        <CheckpointSelect checkpoints={checkpoints} onCheckpointSelect={selectCheckpoint}></CheckpointSelect>
        <br/>
        <RoomSelect rooms={rooms}></RoomSelect>
        <br/>
        <Strats></Strats>
      </div>
  );
}
