from flask import Flask, jsonify, request
from markupsafe import escape
from werkzeug.middleware.proxy_fix import ProxyFix

from config import PROXIES
from database.repository import get_strats_for_room

app = Flask(__name__)

if PROXIES:
    app.wsgi_app = ProxyFix(
        app.wsgi_app, x_for=PROXIES, x_proto=PROXIES, x_host=PROXIES, x_prefix=PROXIES
    )


@app.get('/strats')
def strats():
    return jsonify(get_strats_for_room(escape(request.args['chapter']), escape(request.args['room'])))
