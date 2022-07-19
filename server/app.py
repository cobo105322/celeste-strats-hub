from flask import Flask, jsonify
from markupsafe import escape

from database.repository import get_strats_for_room

app = Flask(__name__)


@app.get('/strats/<chapter>/<room>')
def strats(chapter, room):
    return jsonify(get_strats_for_room(escape(chapter), escape(room)))
