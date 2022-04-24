import { Difficulty } from './Difficulty';
import { Category } from './Category';
export interface Strat{
    id: number,
    categories: Category[],
    difficulties: Difficulty[],    
    // tags: string[],
    summary: string,
    description: string,
    gif: string,
    room_id: string,
    entry_id: string,
    exit_id: string,
    user_id: number,
    user: string,
    time: number,
    previous_strat: number
}