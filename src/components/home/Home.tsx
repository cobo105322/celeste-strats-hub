import './Home.css';

import React from 'react';
import { Chapter, ChapterTree, Checkpoint, Side, iRoom } from '../../models/interfaces/ChapterTree';

import { Accordion, AccordionTab } from 'primereact/accordion';

import {Link} from "react-router-dom";


interface HomeProps {
    filteredTree: ChapterTree
}

interface HomeState {
    chapterKey: string,
    side: Side,
    sideNumber: number,
    checkpoint: Checkpoint
    checkpointNumber: number,
    activeIndex: number
}
export default class Home extends React.PureComponent<HomeProps, HomeState> {
    constructor(props: any) {
        super(props);
        this.state = {
            chapterKey: null,
            side: null,
            sideNumber: null,
            checkpoint: null,
            checkpointNumber: null,
            activeIndex: 0
        }
    }

    getChapterSides(chapterKey: string): Side[] {
        let tree: any = this.props.filteredTree;
        return tree[chapterKey] ? tree[chapterKey].sides : [];
    }

    getSideCheckpoints(side: Side): Checkpoint[] {
        return side.checkpoints;
    }

    getCheckpointRooms(checkpoint: Checkpoint): iRoom[] {
        return checkpoint.rooms;
    }


    renderChapter(chapterKey: string, chapter: Chapter): JSX.Element {
        let firstimg = chapter.sides[0].checkpoints[0].rooms[0].id;
        return (
            <div key={"home_ch_" + chapterKey} className="col-6 lg:col-2"
                onClick={() => this.setState({ chapterKey: chapterKey, side: null, sideNumber: null, checkpoint: null, checkpointNumber: null, activeIndex: 1 })}
            >
                <p>{chapter.name}</p>
                <img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${firstimg}.png`} />
            </div>
        );
    }

    renderChapters(): JSX.Element {
        let tree: any = this.props.filteredTree;
        let chapters: JSX.Element[] = [];
        for (let chapterKey in this.props.filteredTree) {
            chapters.push(this.renderChapter(chapterKey, tree[chapterKey]))
        }
        return (
            <div className="grid home-select-div">
                {/* <div className="col-12"><h2>Chapters</h2></div> */}
                {chapters}
            </div>
        )
    }

    renderSide(side: Side, sideNum: number): JSX.Element {
        let firstimg = side.checkpoints[0].rooms[0].id;
        return (
            <div key={"home_side_" + side.name} className="col-6 lg:col-3" onClick={() => this.setState({ side: side, checkpoint: null, activeIndex: 2 })}>
                <p>{side.name}</p>
                <img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${firstimg}.png`} />
            </div>
        );
    }


    renderSides(): JSX.Element {
        if (!this.state.chapterKey) return <div />
        let sides: Side[] = this.getChapterSides(this.state.chapterKey);
        return (
            <div className="grid home-select-div">                
                {sides.map((side, i) => this.renderSide(side, i))}
            </div>
        )
    }

    renderCheckpoint(checkpoint: Checkpoint): JSX.Element {
        let firstimg = checkpoint.rooms[0].id;
        return (
            <div key={"home_check_" + checkpoint.name} className="col-6 lg:col-3" onClick={() => this.setState({ checkpoint: checkpoint, activeIndex: 3 })}>
                <p>{checkpoint.name}</p>
                {<img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${firstimg}.png`} />}
            </div>
        );
    }

    renderCheckpoints(): JSX.Element {
        if (!this.state.chapterKey || !this.state.side) return <div />
        let checkpoints: Checkpoint[] = this.getSideCheckpoints(this.state.side);
        return (
            <div className="grid home-select-div">                
                {checkpoints.map((checkpoint, i) => this.renderCheckpoint(checkpoint))}
            </div>
        )
    }

    renderRoom(room: iRoom): JSX.Element {    
        if (!this.state.chapterKey || !this.state.side  || !this.state.checkpoint) return <div />
        return (
            <div key={"home_room_" + room.debug_id} className="col-6 lg:col-2">
               <Link to={`/room/${room.id}`}>
                    <p>{room.debug_id}</p>
                    {<img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${room.id}.png`} />}
                </Link>
            </div>
        );
    }

    renderRooms(): JSX.Element {
        if (!this.state.chapterKey || !this.state.side || !this.state.checkpoint) return <div />
        let rooms: iRoom[] = this.getCheckpointRooms(this.state.checkpoint);
        return (
            <div className="grid home-select-div">
                {rooms.map(room => this.renderRoom(room))}
            </div>
        )
    }

    render() {
        return (
            <div className="home">
                <Accordion activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                    <AccordionTab header="Chapters">
                        {this.renderChapters()}
                    </AccordionTab>
                    <AccordionTab disabled = {!this.state.chapterKey} header="Sides">
                        {this.renderSides()}
                    </AccordionTab>
                    <AccordionTab disabled={!this.state.chapterKey || !this.state.side} header="Checkpoints">
                        {this.renderCheckpoints()}
                    </AccordionTab>
                    <AccordionTab disabled={(!this.state.chapterKey || !this.state.side || !this.state.checkpoint)} header="Rooms">
                        {this.renderRooms()}
                    </AccordionTab>
                </Accordion>
            </div>
        );
    }
}
