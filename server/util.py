from pathlib import Path

from sqlalchemy.orm import Session

from config import METADATA_DIR, SPEEDRUN_DATA_DIR
from database.connector import engine
from database.loader import load_all_data
from database.tables import Base
from server.database import repository


def initial_database_setup():
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        load_all_data(session, DATA_DIR)
        session.commit()


if __name__ == '__main__':
    Path('temp.db').unlink()
    initial_database_setup()
    print(repository.get_chapters())
    print(repository.get_checkpoints('1a'))
    print(repository.get_rooms('1a-1'))
