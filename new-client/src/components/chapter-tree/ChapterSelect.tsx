import {List} from 'immutable';
import React from 'react';
import {IChapter} from '../../service/data-interface';
import {ChapterOverview} from './ChapterOverview';
import './ChapterSelect.css';

export function ChapterSelect(props: any) {
  const groupedChapters = List<IChapter>(props.chapters).groupBy(chapter => chapter.token['0']);
  return (
      <div className="chapter-table">
        {groupedChapters.toList().map((chapterGroup, index) =>
            <div className="chapter-group" key={index}>
              {chapterGroup.toList().map((chapter, index) =>
                  <ChapterOverview key={index} chapter={chapter} onClick={props.onChapterSelect}></ChapterOverview>,
              )}
            </div>,
        )}
      </div>
  );
}
