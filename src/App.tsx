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
import Navbar from './components/navbar/Navbar';
import Room from './components/room/Room';
import { FilterState } from './models/interfaces/FilterState';

interface AppState {
  chapterTree: ChapterTree,
  filteredTree: ChapterTree,
  currentFilters: FilterState
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
      }
    }
  }

  render() {    
    return (
      <div className="App">
        <div className="grid">
          <div className="hidden md:block col-2"><Navbar/></div>
          <div className="col-12 lg:col-10">
            <Filter onFilterUpdate={(currentFilters: FilterState)=>this.setState({currentFilters: currentFilters})}/>
            <Switch>                                          
              <Route path="/room/:id" render={routeProps => <Room params={(routeProps.match.params as any)} filters={this.state.currentFilters} chapterTree={this.state.chapterTree} />} />
              <Route path="/about" render={()=><About filteredTree={this.state.filteredTree} />} />
              <Route path="/" render={()=><Home filteredTree={this.state.filteredTree} />} />
              
            </Switch> 
          </div>
        </div>
      </div>
    );
  }
}

