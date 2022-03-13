import './Home.css';

import React from 'react';
import { Chapter, ChapterTree, Checkpoint, Side, Room } from '../../models/interfaces/ChapterTree';

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

    getSideCheckpoints(chapterKey: string, sideIndex: number): Checkpoint[] {
        let tree: any = this.props.filteredTree;
        return (tree[chapterKey] && tree[chapterKey].sides && tree[chapterKey].sides[sideIndex]) ? tree[chapterKey].sides[sideIndex].checkpoints : [];
    }

    getCheckpointRooms(chapterKey: string, sideIndex: number, checkpointIndex: number): Room[] {
        let tree: any = this.props.filteredTree;
        return tree[chapterKey].sides[sideIndex].checkpoints[checkpointIndex].rooms;
    }


    renderChapter(chapterKey: string, chapter: Chapter): JSX.Element {
        return (
            <div key={"home_ch_" + chapterKey} className="col-6 lg:col-2"
                onClick={() => this.setState({ chapterKey: chapterKey, side: null, sideNumber: null, checkpoint: null, checkpointNumber: null, activeIndex: 1 })}
            >
                <p>{chapter.name}</p>
                <img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${chapterKey}_1_1_1.png`} />
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

    renderSide(side: Side, sideNum: number, chapterKey: string): JSX.Element {
        return (
            <div key={"home_side_" + side.name} className="col-6 lg:col-3" onClick={() => this.setState({ side: side, sideNumber: sideNum, checkpoint: null, checkpointNumber: null, activeIndex: 2 })}>
                <p>{side.name}</p>
                {<img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${chapterKey}_${sideNum}_1_1.png`} />}
            </div>
        );
    }


    renderSides(): JSX.Element {
        if (!this.state.chapterKey) return <div />
        let sides: Side[] = this.getChapterSides(this.state.chapterKey);
        return (
            <div className="grid home-select-div">
                {/* <div className="col-12"><h2>Sides</h2></div> */}
                {sides.map((side, i) => this.renderSide(side, i + 1, this.state.chapterKey))}
            </div>
        )
    }

    renderCheckpoint(checkpoint: Checkpoint, checkpointNum: number, sideNum: number, chapterKey: string): JSX.Element {
        return (
            <div key={"home_check_" + checkpoint.name} className="col-6 lg:col-3" onClick={() => this.setState({ checkpoint: checkpoint, checkpointNumber: checkpointNum, activeIndex: 3 })}>
                <p>{checkpoint.name}</p>
                {<img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${chapterKey}_${sideNum}_${checkpointNum}_1.png`} />}
            </div>
        );
    }

    renderCheckpoints(): JSX.Element {
        if (!this.state.chapterKey || !this.state.side) return <div />
        let checkpoints: Checkpoint[] = this.getSideCheckpoints(this.state.chapterKey, this.state.sideNumber - 1);
        return (
            <div className="grid home-select-div">
                {/* <div className="col-12"><h2>Sides</h2></div> */}
                {checkpoints.map((checkpoint, i) => this.renderCheckpoint(checkpoint, i + 1, this.state.sideNumber, this.state.chapterKey))}
            </div>
        )
    }

    renderRoom(room: Room, checkpointNum: number, sideNum: number, chapterKey: string): JSX.Element {        
        return (
            <div key={"home_room_" + room.debug_id} className="col-6 lg:col-2">
               <Link to={`/room/${chapterKey}/${sideNum}/${checkpointNum}/${room.debug_id}`}>
                    <p>{room.debug_id}</p>
                    {<img style={{ width: '100%' }} src={`${process.env.PUBLIC_URL}/img/room/${chapterKey}_${sideNum}_${checkpointNum}_${room.image}.png`} />}
                </Link>
            </div>
        );
    }

    renderRooms(): JSX.Element {
        if (!this.state.chapterKey || !this.state.side || !this.state.checkpoint) return <div />
        let rooms: Room[] = this.getCheckpointRooms(this.state.chapterKey, this.state.sideNumber - 1, this.state.checkpointNumber-1);
        return (
            <div className="grid home-select-div">
                {rooms.map(room => this.renderRoom(room, this.state.checkpointNumber, this.state.sideNumber, this.state.chapterKey))}
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
