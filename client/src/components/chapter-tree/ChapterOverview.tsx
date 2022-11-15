import React from 'react';
import './ChapterOverview.css';
import {Chapter} from '../../generated';

interface Props {
  chapter: Chapter;
  onClick: (token: string) => void;
}

export function ChapterOverview({chapter, onClick}: Props) {
  return (
      chapter && <div className="chapter-box" onClick={() => onClick(chapter.token)}>
        <img className="chapter-thumbnail" src={'assets/' + chapter.image}></img>
        {chapter.name}
      </div>
  );
}
