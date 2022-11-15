import json
from os import PathLike
from pathlib import Path
from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from .factory import chapter_factory, checkpoint_factory
from .tables import Category, Chapter, Checkpoint, Difficulty, Room, Strat


def load_hardcoded(session: Session):
    for category in ['Any%', 'ARB', '100%', 'All Cassettes', 'All Hearts', 'All A Sides', 'All B Sides', 'All C Sides']:
        session.add(Category(label=category))
    for difficulty in ['Master', 'Very hard', 'Hard', 'Intermediate', 'Easy', 'Beginner']:
        session.add(Difficulty(label=difficulty))


def load_chapter_tree(session: Session, file: PathLike):
    with open(file, mode='r') as f:
        chapter_tree = json.load(f)

    for chapter_data in chapter_tree.values():
        for side_data in chapter_data['sides']:
            chapter = chapter_factory(chapter_data['chapter_no'], chapter_data['name'], side_data['name'])
            session.add(chapter)
            chapter_rooms_links = {}
            for checkpoint_index, checkpoint_data in enumerate(side_data['checkpoints']):
                checkpoint = checkpoint_factory(chapter, checkpoint_index + 1, checkpoint_data['name'])
                session.add(checkpoint)
                for room_data in checkpoint_data['rooms']:
                    room = Room(code=room_data['debug_id'], nickname=room_data['name'], image=room_data['image'],
                                checkpoint=checkpoint)
                    session.add(room)
                    chapter_rooms_links[room.code] = (room, room_data.get('linked', []))
            for room, links in chapter_rooms_links.values():
                room.connected_rooms = [chapter_rooms_links[room_code][0] for room_code in links]


def get_rooms_in_range(start_room: Room, start_detail: str, end_room: Room, end_detail: str) -> List[Room]:
    if start_room == end_room:
        return [start_room]
    return [start_room]


def load_chapter_strats(session: Session, file: PathLike, chapter_number: int, side: str):
    with open(file) as f:
        strat_list = json.load(f)

    for strat_data in strat_list:
        def split_safe(to_split):
            split = to_split.split(' ', 1)
            if len(split) == 1:
                return split[0], '*'
            return tuple(split)
        start_room_code, start_detail = split_safe(strat_data['start'])
        end_room_code, end_detail = split_safe(strat_data['end'])
        select_chapter_rooms = select(Room).join(
            Room.checkpoint).join(Checkpoint.chapter.and_(Chapter.number == chapter_number, Chapter.side == side))
        start_room = session.scalar(select_chapter_rooms.where(Room.code == start_room_code))
        end_room = session.scalar(select_chapter_rooms.where(Room.code == end_room_code))
        strat = Strat(nickname=strat_data['name'],
                      description=strat_data['description'],
                      notes=strat_data.get('notes'),
                      start_room=start_room, start_detail=start_detail, end_room=end_room, end_detail=end_detail)
        strat.rooms = get_rooms_in_range(start_room, start_detail, end_room, end_detail)
        session.add(strat)


def load_all_data(session: Session, data_root: Path):
    load_hardcoded(session)
    load_chapter_tree(session, data_root.joinpath('chapter-tree.json'))
    load_chapter_strats(session, data_root.joinpath('strats/1a/1a.json'), 1, 'A')
