import { EnumDifficulty } from './../enums/EnumDifficulty';
import { EnumCategory } from './../enums/EnumCategory';
export interface Strat{
    categories: EnumCategory[],
    difficulty: EnumDifficulty[],
    tags: string[],
    room_id: string,
    entry_id: string,
    exit_id: string
}