export interface iRoom{
    name: string,
    debug_id: string,
    id: string,
    image: string,
    linked: string[]
}

export interface Checkpoint{
    name: string,
    abbreviation: string,
    rooms: iRoom[],
}

export interface Side{
    name: string,
    official: boolean, //For in case we end up adding modded levels - this was already set on the json so why not leave it there for now
    checkpoints: Checkpoint[],
}

export interface Chapter{
    name: string,
    chapter_no: number,
    official: boolean,
    sides: Side[]
}

export interface ChapterTree {
    prologue: Chapter,
    city: Chapter,
    site: Chapter,
    resort: Chapter,
    ridge: Chapter,
    temple: Chapter,
    reflection: Chapter,
    summit: Chapter,
    //epilogue: Chapter, //No point to include epilogue
    core: Chapter,
    farewell: Chapter
}