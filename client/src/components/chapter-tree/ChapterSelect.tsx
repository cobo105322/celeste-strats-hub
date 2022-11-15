import {List} from 'immutable';
import React from 'react';
import {Chapter} from '../../generated';
import {ChapterOverview} from './ChapterOverview';
import './ChapterSelect.css';

interface Props {
  chapters: Chapter[];
  onChapterSelect: (token: string) => void;
}

export function ChapterSelect({chapters, onChapterSelect}: Props) {
  const groupedChapters = List<Chapter>(chapters).groupBy(chapter => chapter.token['0']);
  return (
      <div className="chapter-table">
        {groupedChapters.toList().map((chapterGroup, index) =>
            <div className="chapter-group" key={index}>
              {chapterGroup.toList().map((chapter, index) =>
                  <ChapterOverview key={index} chapter={chapter} onClick={onChapterSelect}></ChapterOverview>,
              )}
            </div>,
        )}
      </div>
  );
}
