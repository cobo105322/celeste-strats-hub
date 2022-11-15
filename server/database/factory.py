from pathlib import PurePosixPath

from .tables import Chapter, Checkpoint, Room


def chapter_factory(chapter_number: int, chapter_name: str, side: str) -> Chapter:
    assert len(side) == 1
    token = str(chapter_number) + side.lower()
    full_name = chapter_name
    if side != 'A':
        full_name += f' {side}-Side'
    image = str(PurePosixPath('meta', 'chapters', token).with_suffix('.png'))
    return Chapter(token=token, number=chapter_number, side=side, full_name=full_name, image=image)


def checkpoint_factory(chapter: Chapter, checkpoint_number: int, name: str) -> Checkpoint:
    token = chapter.token + '-' + str(checkpoint_number)
    image = str(PurePosixPath('meta', 'checkpoints', token).with_suffix('.png'))
    return Checkpoint(token=token, number=checkpoint_number, name=name, chapter=chapter, image=image)


def room_factory(checkpoint: Checkpoint, code: str, nickname: str) -> Room:
    image = str(PurePosixPath('meta', 'rooms', checkpoint.chapter.token + '-' + code).with_suffix('.png'))
    return Room(code=code, nickname=nickname, image=image, checkpoint=checkpoint, chapter=checkpoint.chapter)
