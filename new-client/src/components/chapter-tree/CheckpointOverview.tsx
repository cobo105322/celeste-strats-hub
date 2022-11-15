import React from 'react';
import './CheckpointOverview.css';

export function CheckpointOverview(props: any) {
  return (
      <div className="checkpoint-box" onClick={() => props.onClick(props.checkpoint.token)}>
        <img className="checkpoint-thumbnail" src={'assets/checkpoints/' + props.checkpoint.token + '.png'}></img>
        {props.checkpoint.name}
      </div>
  );
}
