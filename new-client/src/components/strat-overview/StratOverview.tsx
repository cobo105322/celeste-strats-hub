import React from 'react';
import {StratDetail} from '../strat-detail/StratDetail';

export function StratOverview(props: any) {
  return (
      <div>
      <table>
        <tbody>
        <tr>
          <td>Name:</td>
          <td>{props.strat.name}</td>
        </tr>
        <tr>
          <td>Start Point:</td>
          <td>{props.strat.start}</td>
        </tr>
        <tr>
          <td>End Point:</td>
          <td>{props.strat.end}</td>
        </tr>
        <tr>
          <td>Difficulty:</td>
          <td>{}</td>
        </tr>
        <tr>
          <td>Time:</td>
          <td>{}</td>
        </tr>
        </tbody>
      </table>
      <div>
        <StratDetail strat={props.strat}></StratDetail>
      </div>
      </div>
  );
}