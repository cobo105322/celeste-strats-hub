from sqlalchemy import select
from sqlalchemy.orm import Session

from .connector import engine
from .tables import Chapter, Checkpoint, Room


def get_strats_for_room(chapter: str, room: str):
    with Session(engine) as session:
        room = session.scalar(select(Room)
                              .join(Room.checkpoint)
                              .join(Checkpoint.chapter.and_(Chapter.short_name == chapter))
                              .where(Room.code == room))
        return [strat.description for strat in room.strats]
