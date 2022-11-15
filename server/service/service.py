from server.database import repository


def get_api_status():
    return {'success': True}


def get_chapters():
    return repository.get_chapters()


def get_checkpoints(chapter):
    return repository.get_checkpoints(chapter)


def get_rooms(checkpoint):
    return repository.get_rooms(checkpoint)


def get_strats(chapter, room):
    return repository.get_strats_for_room(chapter, room)
