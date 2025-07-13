# src/chronomap/routes.py

from flask import Blueprint, make_response
from . import database
import json

bp = Blueprint("main", __name__)

@bp.route('/regions/')
def get_regions():
    regions = database.get_regions()
    return json.dumps(regions)

@bp.route('/region/<region>')
def get_region_frames(region):
    frames = database.get_region_frames(region)
    if not frames:
        return "No frames found", 404
    return json.dumps([frame.to_dict() for frame in frames])

@bp.route('/frame/<id>', methods=['GET'])
def get_frame(id):
    frame = database.get_frame_by_id(id)
    if not frame:
        return "Frame not found", 404
    response = make_response(frame)
    response.headers['Cache-Control'] = 'public, max-age=3600'
    return response
