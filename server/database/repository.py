from sqlalchemy import select
from sqlalchemy.orm import Session

from .tables import Chapter, Checkpoint, Room, Strat
# from generated.openapi_server.models import Chapter


def get_chapters(session: Session) -> list[Chapter]:
    return session.scalars(select(Chapter))


def get_checkpoints(session: Session, chapter_token: str) -> list[Checkpoint]:
    return session.scalars(select(Checkpoint).join(Checkpoint.chapter.and_(Chapter.token == chapter_token)))


def get_rooms(session: Session, checkpoint_token: str):
    return session.scalars(select(Room).join(Room.checkpoint.and_(Checkpoint.token == checkpoint_token)))


# def get_room_details(chapter_token: str, room: str) -> dict:
#     with Session(engine) as session:
#         room = session.scalar(select(Room)
#                               .join(Room.checkpoint)
#                               .join(Checkpoint.chapter.and_(Chapter.token == chapter_token))
#                               .where(Room.code == room))
#         print(room.connected_rooms)
#         return {
#             'code': room.code,
#             'image': room.image,
#             'connected': room.connected_rooms,
#         }


def get_strats_for_room(session: Session, chapter_token: str, room: str) -> list[Strat]:
    room = session.scalar(select(Room)
                          .join(Room.checkpoint)
                          .join(Checkpoint.chapter.and_(Chapter.token == chapter_token))
                          .where(Room.code == room))
    return room.strats
