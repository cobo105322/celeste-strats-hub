import React, {useEffect, useState} from 'react';
import {StratOverview} from '../strat-overview/StratOverview';
import {Api, HttpApi} from '../../service/http-api';
import {IStrat} from '../../service/data-interface';

export function Strats() {
  const [strats, setStrats] = useState<IStrat[]>([]);

  useEffect(() => {
    const serverUrl = process.env.REACT_APP_API_URL ?? '';
    const api: Api = new HttpApi(serverUrl);
    api.apiGet<IStrat[]>('strats', {
      chapter: '1a',
      room: '5',
    }).then(setStrats);
  }, []);

  return (
      <div>
        {strats.map((strat: IStrat, index: number) => <StratOverview key={index} strat={strat}></StratOverview>)}
      </div>
  );
}
