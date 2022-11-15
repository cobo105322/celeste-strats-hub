import React from 'react';
import {Checkpoint} from '../../generated';
import './CheckpointOverview.css';

interface Props {
  checkpoint: Checkpoint;
  onClick: (token: string) => void
}

export function CheckpointOverview({checkpoint, onClick}: Props) {
  return (
      <div className="checkpoint-box" onClick={() => onClick(checkpoint.token)}>
        <img className="checkpoint-thumbnail" src={'assets/' + checkpoint.image}></img>
        {checkpoint.name}
      </div>
  );
}
