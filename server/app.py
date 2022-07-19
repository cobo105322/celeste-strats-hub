from flask import Flask, jsonify
from markupsafe import escape
from werkzeug.middleware.proxy_fix import ProxyFix

from config import PROXIES
from database.repository import get_strats_for_room

app = Flask(__name__)

if PROXIES:
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=PROXIES, x_proto=PROXIES, x_host=PROXIES, x_prefix=PROXIES
    )


@app.get('/strats/<chapter>/<room>')
def strats(chapter, room):
    return jsonify(get_strats_for_room(escape(chapter), escape(room)))
