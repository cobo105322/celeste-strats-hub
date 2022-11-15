import React from 'react';
import {Notes} from '../note/Notes';

export function StratDetail(props: any) {
  return (
      <div>
        <p>{props.strat.description}</p>
        {props.strat.notes && <Notes notes={props.strat.notes}></Notes>}
      </div>
  );
}