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
import RoomDetails from './RoomDetails';

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
    this.state = this.getInitialState()

    this.roomLogic = new RoomLogic(this.props.params.id, this.props.chapterTree);

  }

  componentDidUpdate(prevProps: ComponentProps) {
    if (this.props.params.id !== prevProps.params.id) {
      this.initialize();
    }

  }


  componentDidMount(): void {
    this.initialize();
  }

  getInitialState(): ComponentState {
    return {
      roomStrats: null,
      accordionIndex: 0,
      selectedStrat: null
    }
  }

  initialize() {
    this.roomLogic = new RoomLogic(this.props.params.id, this.props.chapterTree);
    this.setState(this.getInitialState());
    if (!this.roomLogic.roomExists()) {
      return;
    }
    APIService.APICall(EnumAPIEndpoint.GET_STRATS, {
      chapter: this.roomLogic.chapter.chapter_no.toString() + this.roomLogic.side.name.toLowerCase(),
      room: this.roomLogic.room.debug_id,
    }, "get").then((response: Response) => {
      if (response.ok) {
        response.json().then((strats: Strat[]) => this.setState({ roomStrats: strats }));
      }
    })

  }

  getLink(debugId: string) {
    let fullId = this.roomLogic.room.id.substring(0, 3) + debugId;
    //We get the first part of the identifier
    return <Link to={"/room/" + fullId}>{debugId}</Link>
  }

  getLinkById(id: string) {
    //We get the first part of the identifier
    return <Link to={"/room/" + id}>{id}</Link>
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
            {this.roomLogic.room.linked.map((linked_id, i) => <label>{i !== 0 && ', '}{this.getLink(linked_id)}</label>)}
          </div>
        </div>

      </div>)
  }


  renderStratsTable(): JSX.Element {
    if (!this.state.roomStrats) {
      return (
        <div className="loading">
          <p>Loading...</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}> <ReactLoading type="spin" color="#000000" /> </div>
        </div>)
    }
    let filteredStrats: Strat[] = this.roomLogic.getFilteredStrats(this.state.roomStrats, this.props.filters);
    return <div className="grid">
      {filteredStrats.map((strat, i) => {
        return <div key={"strat_" + i} className="col-12 lg:col-4 strat-preview-div">
          <p onClick={() => this.setState({ selectedStrat: strat, accordionIndex: 1 })}>{strat}</p>
          {this.renderStratGif(strat)}
        </div>
      })}
    </div>
  }

  renderStratDetails(): JSX.Element {
    if (!this.state.selectedStrat) return <div />;
    let strat = this.state.selectedStrat;
    return <div className="grid strat-details-div">
      <div className="col-12 lg:col-4">
        {this.renderStratGif(strat)}
      </div>
      <div className="col-12 lg:col-6">
        <p><b>Description:</b> {strat}</p>
        {/*<p><b>Category:</b> {strat.categories.map(c => c.label).join(', ')}</p>*/}
        {/*<p><b>Difficulty:</b> {strat.difficulties.map(c => c.label).join(', ')}</p>*/}
        {/*<p><b>Exit:</b> {this.getLinkById(strat.exit_id)}</p>*/}
      </div>
      <div className="col-12">
        {strat.description}
      </div>
    </div>
  }

  renderStratGif(strat: Strat) {
    return <div className="strat-container">
      <div className="strat-dummy"></div>
      <div className="strat-wrapper">
        {/*<iframe src={strat.gif + '?autoplay=0&controls=0'} height='100%' width='100%' />*/}
      </div>
    </div>
  }

  renderStratsSection() {
    let strats = this.state.roomStrats;
    return (
      <>
        <h2>Strats</h2>
        <Accordion activeIndex={this.state.accordionIndex} onTabChange={(e) => this.setState({ accordionIndex: e.index })}>
          <AccordionTab header="Strats">
            {this.renderStratsTable()}
          </AccordionTab>
          <AccordionTab disabled={!this.state.selectedStrat} header="Details">
            {this.renderStratDetails()}
          </AccordionTab>
        </Accordion>
      </>
    )
  }

  render() {
    if (!this.roomLogic.roomExists()) {
      return <div>Error - room not found.</div>
    }

    return (

      <div className="room">
        <Panel>
          <RoomDetails room={this.roomLogic.room} chapter={this.roomLogic.chapter} checkpoint={this.roomLogic.checkpoint} side={this.roomLogic.side}/>
          {this.renderStratsSection()}

        </Panel>
      </div >
    );
  }
}
