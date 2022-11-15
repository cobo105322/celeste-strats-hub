import React from 'react';
import './ChapterOverview.css';

export function ChapterOverview(props: any) {
  return (
      props.chapter && <div className="chapter-box" onClick={() => props.onClick(props.chapter.token)}>
        <img className="chapter-thumbnail" src={'assets/chapters/' + props.chapter.token + '.png'}></img>
        {props.chapter.name}
      </div>
  );
}
