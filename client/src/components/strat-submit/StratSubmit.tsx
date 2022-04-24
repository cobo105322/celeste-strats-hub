import './StratSubmit.css';
import React from 'react';
import { InputText } from 'primereact/inputtext';
import { ClientService } from '../../utils/ClientService';
import { Toast } from 'primereact/toast';
import { EnumCategory } from '../../models/enums/EnumCategory';
import { EnumDifficulty } from '../../models/enums/EnumDifficulty';
import RoomDetails from '../room/RoomDetails';
import { RoomLogic } from '../room/RoomLogic';
import { ChapterTree } from '../../models/interfaces/ChapterTree';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { SelectItem } from 'primereact/selectitem';
import { Dropdown } from 'primereact/dropdown';
import { Strat } from '../../models/interfaces/Strat';
import { APIService } from '../../utils/ApiService';
import { EnumAPIEndpoint } from '../../models/enums/EnumAPIEndpoint';
import { Button } from 'primereact/button';
import { Redirect } from 'react-router-dom';


interface ComponentState {
    categories: EnumCategory[],
    difficulties: EnumDifficulty[],
    summary: string,
    description: string,
    gif: string,
    entry_id: string,
    exit_id: string,
    time: number,
    previousRoomStrats: Strat[],
    previous_strat: number,
    loading: boolean,
    redirect: boolean

}
interface ComponentProps {
    params: { id: string },
    chapterTree: ChapterTree
}

export default class StratSubmit extends React.PureComponent<ComponentProps, ComponentState> {
    private toast: Toast;
    private roomLogic: RoomLogic;
    constructor(props: any) {
        super(props);
        this.state = {
            categories: [],
            difficulties: [],
            summary: '',
            description: '',
            gif: '',
            entry_id: '',
            exit_id: '',
            time: 0,
            previousRoomStrats: [],
            previous_strat: null,
            loading: false,
            redirect: false
        }
        this.roomLogic = new RoomLogic(this.props.params.id, this.props.chapterTree);
    }

    //TODO - this is copy pasted, export to somewhere common pls
    getCategoryOptions(): SelectItem[] {
        return [
            { label: 'Any%', value: EnumCategory.ANY_PERCENT },
            { label: 'All Red Berries', value: EnumCategory.ALL_RED_BERRIES },
            { label: '100%', value: EnumCategory.HUNDRED_PERCENT },
            { label: 'All Casettes', value: EnumCategory.ALL_CASSETTES },
            { label: 'All Hearts', value: EnumCategory.ALL_HEARTS },
            { label: 'All A Sides', value: EnumCategory.ALL_A_SIDES },
            { label: 'All B sides', value: EnumCategory.ALL_B_SIDES },
            { label: 'All C sides', value: EnumCategory.ALL_C_SIDES },
        ]
    }

    getDifficultyOptions(): SelectItem[] {
        return [
            { label: 'Master', value: EnumDifficulty.MASTER },
            { label: 'Very hard', value: EnumDifficulty.VERY_HARD },
            { label: 'Hard', value: EnumDifficulty.HARD },
            { label: 'Intermediate', value: EnumDifficulty.INTERMEDIATE },
            { label: 'Easy', value: EnumDifficulty.EASY },
            { label: 'Beginner', value: EnumDifficulty.BEGINNER },
        ]
    }

    renderRoomChoices(entry: boolean) {
        let roomChapterId = this.roomLogic.room.id.substring(0, 2);
        let links = this.roomLogic.room.linked.concat("-");

        let colSize = 12 / links.length;
        if (colSize < 4) colSize = 4;
        let choosen = entry ? this.state.entry_id : this.state.exit_id;
        return <div className='grid'>
            {links.map(debugId => {
                let roomId = debugId !== "-" ? (roomChapterId + "-" + debugId) : "map";
                return (
                    <div className={'col-12 lg:col-' + colSize + ' img-pick-div'}
                        onClick={() => { entry ? this.selectEntryRoom(roomId, debugId) : this.setState({ exit_id: debugId }) }}>
                        <label className={choosen === debugId && 'choosen-label'}>{debugId}</label>
                        {choosen === debugId && <i className='pi pi-check' />}
                        <br />
                        <img style={{ width: '90%' }} src={`${process.env.PUBLIC_URL}/img/room/${roomId}.png`} />
                    </div>
                )
            }
            )}
        </div>
    }

    selectEntryRoom(roomId: string, debugId: string) {
        if (debugId !== "-") {
            APIService.APICall(EnumAPIEndpoint.GET_STRATS, { roomid: roomId }, "get").then((response: Response) => {
                if (response.ok) {
                    response.json().then((strats: Strat[]) => this.setState({ previousRoomStrats: strats }));
                }
            })
        }
        this.setState({ entry_id: debugId, previous_strat: null });

    }

    getPreviousStratsOptions(): SelectItem[] {
        let empty = [{ label: "-", value: null }];
        if (!this.state.previousRoomStrats) return empty
        return empty.concat(
            this.state.previousRoomStrats.map(strat => {
                return { label: strat.summary, value: strat.id };
            })
        )
    }

    checkGifFormat(): boolean {
        return /.*gfycat\.com.*/.test(this.state.gif);
    }

    isSubmitEnabled(): boolean {
        return this.state.summary !== "" && this.state.description !== "" && this.checkGifFormat() && this.state.time > 0 && this.state.categories.length > 0 && this.state.difficulties.length > 0 && this.state.entry_id !== "" && this.state.exit_id !== "" && !this.state.loading;
    }

    submitStrat() {
        if (!this.isSubmitEnabled()) return;
        this.setState({loading: true});
        let roomChapterId = this.roomLogic.room.id.substring(0, 2);
        let args = {
            summary: this.state.summary,
            categories: this.state.categories,
            difficulties: this.state.difficulties,
            description: this.state.description,
            gif: this.state.gif,
            room_id: this.roomLogic.room.id,
            entry_id: roomChapterId+"-"+this.state.entry_id,
            exit_id: roomChapterId+"-"+this.state.exit_id
        };
        if(this.state.previous_strat) args['previous_strat'] = this.state.previous_strat;
        APIService.APICall(EnumAPIEndpoint.SUBMIT_STRAT, args).then(r=>{
            if(r.ok){
                alert("Strat submitted successfully");
                this.setState({redirect:true});
            }else{
                this.setState({loading: false})
            }
            
        })
    }

    render() {
        if (!ClientService.isLogged()) return <div>Log in to be able to submit strats.</div>
        if(this.state.redirect){
            return <Redirect to={"/room/"+this.props.params.id}/>;
        }
        let cs = this.roomLogic.room.linked.length > 2 ? 6 : 6;
        console.log(this.state)
        return (
            
            <div>
                <h2>Strat submission for {this.roomLogic.room.id}</h2>
                <div className="grid">

                    <div className='col-11'>
                        <RoomDetails submitting room={this.roomLogic.room} chapter={this.roomLogic.chapter} checkpoint={this.roomLogic.checkpoint} side={this.roomLogic.side} />
                    </div>
                </div>
                <h3>Submission form</h3>
                <div className="grid submission-form">
                    <div className={'col-' + (12 - cs)}>
                        <p>
                            <b>Summary (*)</b><br />
                            <InputText onChange={(e)=>this.setState({summary: e.target.value})} />
                        </p>
                        <p>
                            <div className='grid'>
                                <div className='col-12 lg:col-10'>
                                    <b>Gfycat link (*)</b><br />
                                    <InputText onChange={(e)=>this.setState({gif: e.target.value})}/>
                                </div>
                                <div className='col-12 lg:col-2'>
                                    <b>Time (*)</b><br />
                                    <InputNumber value={this.state.time} onValueChange={(e) => this.setState({ time: e.target.value })} mode="decimal" minFractionDigits={3} />
                                </div>

                            </div>
                        </p>
                        <p>
                            <b>Description (*)</b><br />
                            <InputTextarea  onChange={(e)=>this.setState({description: e.target.value})}  rows={6} />
                        </p>
                        <div className='grid'>
                            <div className='col-12 lg:col-6'>
                                <b>Categories (*)</b><br />
                                <MultiSelect maxSelectedLabels={3} value={this.state.categories} options={this.getCategoryOptions()} onChange={(e) => this.setState({ categories: e.target.value })} />
                            </div>
                            <div className='col-12 lg:col-6'>
                                <b>Difficulties (*)</b><br />
                                <MultiSelect maxSelectedLabels={3} value={this.state.difficulties} options={this.getDifficultyOptions()} onChange={(e) => this.setState({ difficulties: e.target.value })} />
                            </div>
                        </div>
                        <p>
                            <b>Previous strat (optional)</b><br />
                            <Dropdown value={this.state.previous_strat} options={this.getPreviousStratsOptions()} onChange={(e) => this.setState({ previous_strat: e.target.value })} />
                        </p>
                    </div>

                    <div className={'col-12 lg:col-6'}>
                        <p>
                            <h4>Entry room (*)</h4>
                            {this.renderRoomChoices(true)}
                        </p>
                        <p>
                            <h4>Exit room (*)</h4>
                            {this.renderRoomChoices(false)}
                        </p>
                    </div>
                    <div className={'col-12'}><Button disabled={!this.isSubmitEnabled()} onClick={()=>this.submitStrat()}  label="Submit strat" /></div>
                </div>
            </div>
        );
    }
}
