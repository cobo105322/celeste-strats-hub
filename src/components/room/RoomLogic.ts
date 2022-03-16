import { Strat } from './../../models/interfaces/Strat';
import { FilterState } from './../../models/interfaces/FilterState';
import { Chapter, Side, Checkpoint, iRoom } from './../../models/interfaces/ChapterTree';
import { ChapterTree } from "../../models/interfaces/ChapterTree";
interface FullRoom {
    chapter: Chapter;
    side: Side;
    checkpoint: Checkpoint;
    room: iRoom;
}
export class RoomLogic {
    private fullroom: FullRoom = null;
    constructor(roomId: string, chapterTree: ChapterTree) {
        this.fullroom = this.getRoom(roomId, chapterTree);
    }

    get chapter() { return this.fullroom.chapter; }
    get side() { return this.fullroom.side; }
    get checkpoint() { return this.fullroom.checkpoint; }
    get room() { return this.fullroom.room; }

    private getRoom(roomId: string, chapterTree: ChapterTree): FullRoom {
        let tree: ChapterTree = chapterTree;
        for (let x in tree) {
            let chapter: Chapter = tree[x];
            for (let i = 0; i < chapter.sides.length; i++) {
                let side: Side = chapter.sides[i];
                for (let j = 0; j < side.checkpoints.length; j++) {
                    let checkpoint: Checkpoint = side.checkpoints[j];
                    for (let k = 0; k < checkpoint.rooms.length; k++) {
                        let room = checkpoint.rooms[k];
                        if (room.id === roomId) {
                            return {
                                chapter: chapter,
                                side: side,
                                checkpoint: checkpoint,
                                room: room
                            }
                        }
                    }
                }
            }
        }
        return null;
    }

    roomExists() {
        return this.fullroom !== null;
    }

    getFilteredStrats(strats: Strat[], filters: FilterState): Strat[]{
        return strats.filter(strat=>
            (!filters.category.length || filters.category.some(cat=>strat.categories.includes(cat))) &&
            (!filters.difficulty.length || filters.difficulty.some(diff=>strat.difficulty.includes(diff))) &&            
            (!filters.tags || strat.tags.includes(filters.tags))
        );
    }

}