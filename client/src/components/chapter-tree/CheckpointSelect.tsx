import React from 'react';
import {Checkpoint} from '../../generated';
import {CheckpointOverview} from './CheckpointOverview';
import './CheckpointSelect.css';

interface Props {
  checkpoints: Checkpoint[];
  onCheckpointSelect: (token: string) => void;
}

export function CheckpointSelect({checkpoints, onCheckpointSelect}: Props) {
  return (
      <div className="checkpoint-group">
        {checkpoints.map((checkpoint: any) =>
            <CheckpointOverview key={checkpoint.token} checkpoint={checkpoint} onClick={onCheckpointSelect}></CheckpointOverview>,
        )}
      </div>
  );
}