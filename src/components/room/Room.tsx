import './Room.css';

import React from 'react';
import { Chapter, ChapterTree, Checkpoint, iRoom, Side } from '../../models/interfaces/ChapterTree';
import { Link, RouteComponentProps, useParams } from "react-router-dom";
import { Strat } from '../../models/interfaces/Strat';
import { FilterState } from '../../models/interfaces/FilterState';
import ReactLoading from 'react-loading';
import { APIService } from '../../utils/ApiService';
import { EnumAPIEndpoint } from '../../models/enums/EnumAPIEndpoint';
import { Panel } from 'primereact/panel';
import { RoomLogic } from './RoomLogic';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { isThisTypeNode } from 'typescript';

interface MatchParams {
  id: string
}



interface ComponentProps {
  chapterTree: ChapterTree,
  filters: FilterState,
  params: MatchParams
}

interface ComponentState {
  roomStrats: Strat[],
  accordionIndex: number,
  selectedStrat: Strat
}

export default class Room extends React.Component<ComponentProps, ComponentState> {

  private roomLogic: RoomLogic;
  constructor(props: any) {
    super(props);
    this.state = {
      roomStrats: null,
      accordionIndex: 1,
      selectedStrat: null
    }

    this.roomLogic = new RoomLogic(this.props.params.id, this.props.chapterTree);

  }

  componentDidUpdate(prevProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.initialize();
    }
  }


  componentDidMount(): void {
    this.initialize();
  }

  initialize() {
    this.roomLogic = new RoomLogic(this.props.params.id, this.props.chapterTree);
    setTimeout(() => {
      APIService.APICall(EnumAPIEndpoint.GET_STRATS, { room_id: this.props.params.id }).then((strats: Strat[]) => {
        this.setState({ roomStrats: strats })
      })
    }, 1); //Simulating load
  }

  getLink(debugId: string) {
    let fullId = this.roomLogic.room.id.substring(0, 3) + debugId;
    //We get the first part of the identifier
    return <Link to={"/room/" + fullId}>{debugId}</Link>
  }

  renderRoomImage() {
    return (
      <div className="col-12 lg:col-6">
        <h2>{`${this.roomLogic.chapter.name} ${this.roomLogic.chapter.chapter_no != 9 ? this.roomLogic.side.name + ' side' : ''} - ${this.roomLogic.checkpoint.name}`}</h2>
        <img style={{ width: '320px' }} src={`${process.env.PUBLIC_URL}/img/room/${this.roomLogic.room.id}.png`} />
      </div>)
  }

  renderRoomData() {
    return (
      <div className="col-12 lg:col-6">
        <h3>Room Data</h3>
        <div className="grid roomdata-row">
          <div className="col-4 roomdata-title">
            Chapter
            </div>
          <div className="col-8 roomdata-data">
            {this.roomLogic.chapter.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Side
            </div>
          <div className="col-8 roomdata-data">
            {this.roomLogic.side.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Checkpoint
            </div>
          <div className="col-8 roomdata-data">
            {this.roomLogic.checkpoint.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Debug id
            </div>
          <div className="col-8 roomdata-data">
            {this.roomLogic.room.debug_id}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Adjacent
            </div>
          <div className="col-8">
            {this.roomLogic.room.linked.map((link, i) => <label>{i !== 0 && ', '}{this.getLink(link)}</label>)}
          </div>
        </div>

      </div>)
  }
  
  renderStratsTable(): JSX.Element{
    return <div className="grid">
      {this.state.roomStrats.map(strat=>{
        return <div className="col-6 lg:col-3">
          <p>{strat.summary}</p>
          <iframe src={strat.gif+'?autoplay=1'} ></iframe>
        </div>
      })}
    </div>
  }

  renderStratsSection() {
    let strats = this.state.roomStrats;
    return (
      <>
        <h2>Strats</h2>
        <Accordion activeIndex={this.state.accordionIndex} onTabChange={(e) => this.setState({ accordionIndex: e.index })}>
          <AccordionTab header="Strats">
            {this.renderStratsTable}
          </AccordionTab>
          <AccordionTab disabled={!this.state.selectedStrat} header="Details">
            
          </AccordionTab>
          {/* <AccordionTab disabled={!this.state.chapterKey || !this.state.side} header="Checkpoints">
            {this.renderCheckpoints()}
          </AccordionTab>
          <AccordionTab disabled={(!this.state.chapterKey || !this.state.side || !this.state.checkpoint)} header="Rooms">
            {this.renderRooms()}
          </AccordionTab> */}
        </Accordion>
      </>
    )
  }

  render() {
    if (!this.roomLogic.roomExists()) {
      return <div>Error - room not found.</div>
    }
    if (!this.state.roomStrats) {
      return (
        <div className="loading">
          <p>Loading...</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}> <ReactLoading type="spin" color="#000000" /> </div>
        </div>)
    }

    return (

      <div className="room">
        <Panel>
          <div className="grid">
            {this.renderRoomImage()}
            {this.renderRoomData()}
          </div>
          {this.renderStratsSection()}

        </Panel>
      </div >
    );
  }
}
