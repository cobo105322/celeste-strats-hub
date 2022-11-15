from sqlalchemy import select
from sqlalchemy.orm import Session

from .connector import engine
from .tables import Chapter, Checkpoint, Room
# from generated.openapi_server.models import Chapter


def get_chapters():
    with Session(engine) as session:
        chapters = session.scalars(select(Chapter))
        return [{
            'token': chapter.token,
            'name': chapter.full_name,
            'image': chapter.image,
        } for chapter in chapters]


def get_checkpoints(chapter_token: str):
    with Session(engine) as session:
        checkpoints = session.scalars(select(Checkpoint)
                                      .join(Checkpoint.chapter.and_(Chapter.token == chapter_token)))
        return [{
            'token': checkpoint.token,
            'name': checkpoint.name,
            'image': checkpoint.image,
        } for checkpoint in checkpoints]


def get_rooms(checkpoint_token: str):
    with Session(engine) as session:
        rooms = session.scalars(select(Room)
                                .join(Room.checkpoint.and_(Checkpoint.token == checkpoint_token)))
        return [{
            'code': room.code,
            'image': room.image,
        } for room in rooms]


def get_strats_for_room(chapter_token: str, room: str) -> list[dict]:
    with Session(engine) as session:
        room = session.scalar(select(Room)
                              .join(Room.checkpoint)
                              .join(Checkpoint.chapter.and_(Chapter.token == chapter_token))
                              .where(Room.code == room))
        return [{
            'name': strat.nickname,
            'description': strat.description,
            'notes': strat.notes,
            'start': ' '.join((strat.start_room.code, strat.start_detail)),
            'end': ' '.join((strat.end_room.code, strat.end_detail)),
        } for strat in room.strats]
