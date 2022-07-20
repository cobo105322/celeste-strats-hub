import React from 'react';
import './App.css';
// import store from './redux/store';
// import {updateCategories} from './redux/filterSlice';
import { Switch, Route, Link } from "react-router-dom";
import Home from './components/home/Home';
import { ChapterTree } from './models/interfaces/ChapterTree';
import About from './components/about/About';
import Filter from './components/filter/Filter';
import { EnumDifficulty } from './models/enums/EnumDifficulty';
import Room from './components/room/Room';
import { FilterState } from './models/interfaces/FilterState';
import LeftNavbar from './components/left-navbar/LeftNavbar';
import TopNavbar from './components/top-navbar/TopNavbar';
import Login from './components/auth/Login';
import { Dialog } from 'primereact/dialog';
import { APIService } from './utils/ApiService';
import { EnumAPIEndpoint } from './models/enums/EnumAPIEndpoint';
import { ClientService } from './utils/ClientService';
import StratSubmit from './components/strat-submit/StratSubmit';

interface AppState {
  chapterTree: ChapterTree,
  filteredTree: ChapterTree,
  currentFilters: FilterState,
  renderingLogin: boolean
}
export default class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);

    const chapterTree: ChapterTree = require('./data/chapter-tree.json');

    this.state = {
      chapterTree: chapterTree,
      filteredTree: chapterTree,
      currentFilters: {
        category: [],
        difficulty: [],
        from: [],
        tags: ''
      },
      renderingLogin: false
    }
  }

  componentDidMount(): void {
    //We try to autologin
    // APIService.APICall(EnumAPIEndpoint.AUTOLOGIN, {}).then(r=>{
    //   if(r.ok){
    //     r.json().then(user=>{
    //       ClientService.setUser(user);
    //       this.forceUpdate();
    //     })
    //   }
    // })
  }

  render() {    
    return (
      <div className="App">
        <Dialog header="Login / Register" visible={this.state.renderingLogin}  onHide={() => this.setState({renderingLogin: false})}>
          <Login onDone={()=>this.setState({renderingLogin: false})}/>
        </Dialog>
        <div className="grid">
          {/* <div className="hidden md:block col-2"><LeftNavbar/></div> */}
          <div className="col-12 lg:col-12">
            <TopNavbar renderLogin={()=>this.setState({renderingLogin: true})}></TopNavbar>
            <Filter onFilterUpdate={(currentFilters: FilterState)=>this.setState({currentFilters: currentFilters})}/>
            <Switch>                                          
              <Route path="/room/:id" render={routeProps => <Room params={(routeProps.match.params as any)} filters={this.state.currentFilters} chapterTree={this.state.chapterTree} />} />
              <Route path="/submit/:id" render={routeProps => <StratSubmit params={(routeProps.match.params as any)} chapterTree={this.state.chapterTree} />} />
              <Route path="/about" render={()=><About filteredTree={this.state.filteredTree} />} />
              <Route path="/" render={()=><Home filteredTree={this.state.filteredTree} />} />              
            </Switch> 
          </div>
        </div>
      </div>
    );
  }
}

