# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
import json

# configuration
DATABASE = '/tmp/flaskr.db'

app = Flask(__name__, static_folder="static")
def connect_db():
	return sqlite3.connect(app.config['DATABASE'])

@app.route('/highscores')
def high_scores():
	hs =  [{'name':"mat", 'score':2048}, {'name':"rand", 'score':512}, {'name':"moiraine", 'score':256}, {'name':"lan", 'score':128}, {'name':"nynaeve", 'score':128}, {'name':"bob", 'score':64}, {'name':"thom", 'score':32}, {'name':"min", 'score':16}, {'name':"yolandi", 'score':8}, {'name':"logain", 'score':4}]
	return json.dumps(hs)
	
if __name__ == '__main__':
	app.run()

