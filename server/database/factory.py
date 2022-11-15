from .tables import Chapter, Checkpoint


def chapter_factory(chapter_number: int, chapter_name: str, side: str) -> Chapter:
    assert len(side) == 1
    token = str(chapter_number) + side.lower()
    full_name = chapter_name
    if side != 'A':
        full_name += f' {side}-Side'
    return Chapter(token=token, number=chapter_number, side=side, full_name=full_name)


def checkpoint_factory(chapter: Chapter, checkpoint_number: int, name: str) -> Checkpoint:
    checkpoint_token = chapter.token + '-' + str(checkpoint_number)
    return Checkpoint(token=checkpoint_token, number=checkpoint_number, name=name, chapter=chapter)
