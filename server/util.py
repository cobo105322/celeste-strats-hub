from sqlalchemy.orm import Session

from config import DATA_DIR
from database.connector import engine
from database.loader import load_all_data
from database.tables import Base


def initial_database_setup():
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        load_all_data(session, DATA_DIR)
        session.commit()
