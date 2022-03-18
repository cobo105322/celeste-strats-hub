import { EnumDifficulty } from './../enums/EnumDifficulty';
import { EnumCategory } from './../enums/EnumCategory';
export interface FilterState { //Interface for all the possible filters
    category: EnumCategory[],
    difficulty: EnumDifficulty[],
    tags: string, //Open tags for searching
    from: string[], //TODO: User
}