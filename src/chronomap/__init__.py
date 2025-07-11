from flask import Flask

def create_app():
    app = Flask(__name__)

    # Load config if you have any
    app.config.from_object("chronomap.config.Config")

    # Register routes
    from . import routes
    app.register_blueprint(routes.bp)

    return app
