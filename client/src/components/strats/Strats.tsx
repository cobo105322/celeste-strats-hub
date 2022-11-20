import {Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {DefaultApi, DefaultApiInterface, Strat} from '../../generated';
import {StratOverview} from '../strat-overview/StratOverview';

interface Props {
  chapter?: string;
  room?: string;
}

export function Strats({chapter, room}: Props) {
  const api: DefaultApiInterface = new DefaultApi();
  const [strats, setStrats] = useState<Strat[]>([]);

  useEffect(() => {
    if (chapter && room) {
      api.getStrats({
        chapter: chapter,
        room: room,
      }).then(setStrats);
    } else {
      setStrats([]);
    }
  }, [chapter, room]);

  return (
      <div>
        <Typography variant="h5">Strats</Typography>
        {strats?.map((strat: Strat, index: number) => <StratOverview key={index} strat={strat}></StratOverview>)}
      </div>
  );
}
