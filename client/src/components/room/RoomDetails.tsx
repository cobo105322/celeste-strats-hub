import React from 'react';
import { Link } from 'react-router-dom';
import { Chapter, Checkpoint, iRoom, Side } from '../../models/interfaces/ChapterTree';

interface ComponentProps {
  room: iRoom;
  chapter: Chapter;
  side: Side;
  checkpoint: Checkpoint;
  submitting?: boolean;
}
export default class RoomDetails extends React.PureComponent<ComponentProps, any> {
  constructor(props: any) {
    super(props);
  }

  getLink(debugId: string) {
    let fullId = this.props.room.id.substring(0, 3) + debugId;
    //We get the first part of the identifier
    return <Link to={"/room/" + fullId}>{debugId}</Link>
  }


  renderRoomImage() {
    return (
      <div className="col-12 lg:col-6">
        <h3>{`${this.props.chapter.name} ${this.props.chapter.chapter_no != 9 ? this.props.side.name + ' side' : ''} - ${this.props.checkpoint.name}`}</h3>
        <img style={{ width: '320px' }} src={`${process.env.PUBLIC_URL}/img/room/${this.props.room.id}.png`} />
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
            {this.props.chapter.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Side
          </div>
          <div className="col-8 roomdata-data">
            {this.props.side.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Checkpoint
          </div>
          <div className="col-8 roomdata-data">
            {this.props.checkpoint.name}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Debug id
          </div>
          <div className="col-8 roomdata-data">
            {this.getLink(this.props.room.debug_id)}
          </div>
        </div>
        <div className="grid roomdata-row">
          <div className="col-4  roomdata-title">
            Adjacent
          </div>
          <div className="col-8">
            {this.props.room.linked.map((linked_id, i) => <label>{i !== 0 && ', '}{this.getLink(linked_id)}</label>)}
          </div>
        </div>
        {!this.props.submitting &&
          <div className="grid roomdata-row">
            <div className="col-12">
            <Link to={"/submit/"+this.props.room.id}>Submit strat</Link>
            </div>
          </div>
        }

      </div>)
  }


  render() {
    return (
      <div className="grid">
        {this.renderRoomImage()}
        {this.renderRoomData()}
      </div>
    );
  }
}
