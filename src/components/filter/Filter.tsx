import './Filter.css';

import React from 'react';
import { FilterState } from '../../models/interfaces/FilterState';
import { EnumCategory } from '../../models/enums/EnumCategory';
import { EnumDifficulty } from '../../models/enums/EnumDifficulty';

import { Panel } from 'primereact/panel';
import { MultiSelect } from 'primereact/multiselect';
import { SelectItem } from 'primereact/selectitem';
import { InputText } from 'primereact/inputtext';

interface ComponentState {
    currentFilters: FilterState,
}

interface componentProps {
    onFilterUpdate: (filters: FilterState)=>void;
}

export default class Filter extends React.PureComponent<componentProps, ComponentState> {
    constructor(props: any) {
        super(props);
        this.state = {
            currentFilters: {
                category: [],
                difficulty: [],
                from: [],
                tags: ''
            },
            //   categoryOptions: [],
            //   difficultyOptions: [],
        }
    }

    //We get all the options for the filters - should keep this updated as you add new attributes to the strats we want to filter for
    getCategoryOptions(): SelectItem[] {
        return [
            { label: 'Any%', value: EnumCategory.ANY_PERCENT },
            { label: 'All Red Berries', value: EnumCategory.ALL_RED_BERRIES },
            { label: '100%', value: EnumCategory.HUNDRED_PERCENT },
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

    notifyFiltersUpdated(){
        this.props.onFilterUpdate(this.state.currentFilters);
    }

    render() {
        let { currentFilters } = this.state;
        return (
            <Panel header="Filters" toggleable>
                <div className="grid filters-div">

                    <div className="col-12 md:col-6 lg:col-3">                        
                        <label >Categories</label>
                        <MultiSelect                             
                            id = "category-multiselect"                                                  
                            className='filter'
                            value={currentFilters.category}
                            options={this.getCategoryOptions()}
                            onChange={(e) => {
                                this.setState({ currentFilters: { ...currentFilters, category: e.target.value } }, ()=>this.notifyFiltersUpdated());
                                
                            }}
                            display={"chip"}
                            // maxSelectedLabels = {2}
                            // selectedItemsLabel = {"{0} items selected"}
                        />
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                            <label>Difficulty</label>
                        <MultiSelect
                            value={currentFilters.difficulty}
                            className='filter'
                            options={this.getDifficultyOptions()}
                            onChange={(e) => this.setState({ currentFilters: { ...currentFilters, difficulty: e.target.value } }, ()=>this.notifyFiltersUpdated())}
                            display={"chip"}
                        />
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                            <label>Tags</label>
                        <InputText
                            value={currentFilters.tags}
                            className='filter'                            
                            onChange={(e) => this.setState({ currentFilters: { ...currentFilters, tags: e.target.value } }, ()=>this.notifyFiltersUpdated())}                            
                        />
                    </div>
                </div>
            </Panel >
        );
    }
}
