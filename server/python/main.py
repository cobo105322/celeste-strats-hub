from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from database import Base, Chapter, load_chapter_strats, load_chapter_tree

engine = create_engine('sqlite+pysqlite:///:memory:', echo=False, future=True)

Base.metadata.create_all(engine)

session = Session(engine)
load_chapter_tree(session)
load_chapter_strats(session, 1, 'A')
session.commit()

chapters = session.scalars(select(Chapter)).all()
print('\n'.join(strat.description for strat in chapters[1].checkpoints[0].rooms[5].strats))
print([room.code for room in chapters[1].checkpoints[0].rooms[5].connected_rooms])

session.close()
