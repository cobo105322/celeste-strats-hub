import React from 'react';
import { ChapterTree, Checkpoint, Side } from '../../models/interfaces/ChapterTree';
import {useParams } from "react-router-dom";
interface ComponentProps{
    chapterTree: ChapterTree,
    match: any
}

interface ComponentState{
    chapter: string,
    side: Side,
    checkpoint: Checkpoint,
    room: Room
}

export default class Room extends React.PureComponent<any, ComponentProps> {
    constructor(props: any) {
      super(props);           
      
      console.log(this.props)
    }

    componentDidMount(): void {

    }
  
    render() {
        
      return (
        <div className="room">
            HEWWO THIS IS RWOOM NUMBEW 
        </div>
      );
    }
  }
  