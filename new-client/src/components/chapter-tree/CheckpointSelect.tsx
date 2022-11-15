import React from 'react';
import {CheckpointOverview} from './CheckpointOverview';
import './CheckpointSelect.css';

export function CheckpointSelect(props: any) {
  return (
      <div className="checkpoint-group">
        {props.checkpoints.map((checkpoint: any) =>
            <CheckpointOverview key={checkpoint.token} checkpoint={checkpoint} onClick={props.onCheckpointSelect}></CheckpointOverview>,
        )}
      </div>
  );
}