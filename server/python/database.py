import json

from sqlalchemy import Column, ForeignKey, Integer, String, Table, select
from sqlalchemy.orm import Session, declarative_base, relationship

Base = declarative_base()


class Chapter(Base):
    __tablename__ = 'chapter'
    id = Column(Integer, primary_key=True)
    number = Column(Integer)
    side = Column(String(1))
    name = Column(String, nullable=False, unique=True)
    # unique(number, side)
    checkpoints = relationship('Checkpoint', back_populates='chapter')


class Checkpoint(Base):
    __tablename__ = 'checkpoint'
    id = Column(Integer, primary_key=True)
    chapter_id = Column(Integer, ForeignKey('chapter.id'), nullable=False)
    number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    chapter = relationship('Chapter', back_populates='checkpoints')
    rooms = relationship('Room', back_populates='checkpoint')


room_connections = Table('room_connections', Base.metadata,
                         Column('room_a_id', Integer, ForeignKey('room.id'), primary_key=True),
                         Column('room_b_id', Integer, ForeignKey('room.id'), primary_key=True))


room_strats = Table('room_strats', Base.metadata,
                    Column('room_id', Integer, ForeignKey('room.id'), primary_key=True),
                    Column('strat_id', Integer, ForeignKey('strat.id'), primary_key=True))


class Room(Base):
    __tablename__ = 'room'
    id = Column(Integer, primary_key=True)
    checkpoint_id = Column(Integer, ForeignKey('checkpoint.id'), nullable=False)
    code = Column(String, nullable=False)
    nickname = Column(String)
    image = Column(String)
    checkpoint = relationship('Checkpoint', back_populates='rooms')
    connected_rooms = relationship('Room',
                                   secondary='room_connections',
                                   primaryjoin=id == room_connections.c.room_a_id,
                                   secondaryjoin=id == room_connections.c.room_b_id)
    strats = relationship('Strat', secondary='room_strats', back_populates='rooms')


class Strat(Base):
    __tablename__ = 'strat'
    id = Column(Integer, primary_key=True)
    nickname = Column(String)
    start_room_id = Column(Integer, ForeignKey('room.id'), nullable=False)
    start_detail = Column(String)
    end_room_id = Column(Integer, ForeignKey('room.id'), nullable=False)
    end_detail = Column(String)
    description = Column(String)
    notes = Column(String)
    start_room = relationship('Room', foreign_keys=start_room_id)
    end_room = relationship('Room', foreign_keys=end_room_id)
    rooms = relationship('Room', secondary=room_strats, back_populates='strats')


# Other tables???
# fullgame_categories:
#   id
#   name
#   ???
#
# chapter_categories:
#   id
#   name varchar
#   (any%, arb, h, c, hc, 100%)
#
# routes:
#   chapter_id
#   room_id
#   checkpoint_id
#   room_number


def load_chapter_tree(session: Session):
    with open('chapter-tree.json', mode='r') as f:
        chapter_tree = json.load(f)

    for chapter_data in chapter_tree.values():
        for side_data in chapter_data['sides']:
            side = side_data['name']
            chapter_name = chapter_data['name']
            if side != 'A':
                chapter_name += f' {side}-Side'
            chapter = Chapter(number=chapter_data['chapter_no'], side=side_data['name'], name=chapter_name)
            session.add(chapter)
            chapter_rooms_links = {}
            for checkpoint_index, checkpoint_data in enumerate(side_data['checkpoints']):
                checkpoint = Checkpoint(number=checkpoint_index + 1, name=checkpoint_data['name'], chapter=chapter)
                session.add(checkpoint)
                for room_data in checkpoint_data['rooms']:
                    room = Room(code=room_data['debug_id'], nickname=room_data['name'], image=room_data['image'],
                                checkpoint=checkpoint)
                    session.add(room)
                    chapter_rooms_links[room.code] = (room, room_data.get('linked', []))
            for room, links in chapter_rooms_links.values():
                room.connected_rooms = [chapter_rooms_links[room_code][0] for room_code in links]


def get_rooms_in_range(start_room: Room, start_detail: str, end_room: Room, end_detail: str) -> list[Room]:
    if start_room == end_room:
        return [start_room]
    return [start_room]


def load_chapter_strats(session: Session, chapter_number: int, side: str):
    with open(f'{chapter_number}{side.lower()}.json') as f:
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
        strat = Strat(nickname=strat_data['name'], description=strat_data['description'],
                      start_room=start_room, start_detail=start_detail, end_room=end_room, end_detail=end_detail)
        strat.rooms = get_rooms_in_range(start_room, start_detail, end_room, end_detail)
        session.add(strat)
