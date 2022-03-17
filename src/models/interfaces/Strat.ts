import { EnumDifficulty } from './../enums/EnumDifficulty';
import { EnumCategory } from './../enums/EnumCategory';
export interface Strat{
    id: number,
    categories: EnumCategory[],
    difficulty: EnumDifficulty[],    
    tags: string[],
    summary: string,
    description: string,
    gif: string,
    room_id: string,
    entry_id: string,
    exit_id: string
}