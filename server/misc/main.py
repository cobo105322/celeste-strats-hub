from sqlalchemy import select
from sqlalchemy.orm import Session

from database import engine
from repository import get_strats_for_room
from tables import Chapter

print(get_strats_for_room('1a', '5'))
with Session(engine) as session:
    chapters = session.scalars(select(Chapter)).all()
    print('\n'.join(strat.description for strat in chapters[1].checkpoints[0].rooms[5].strats))
    print([room.code for room in chapters[1].checkpoints[0].rooms[5].connected_rooms])
