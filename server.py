# all the imports
import sqlite3
from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash
import json
from contextlib import closing

# configuration
DATABASE = 'highscores.db'

app = Flask(__name__, static_folder="static")
def connect_db():
	return sqlite3.connect(DATABASE)

def init_db():
	with closing(connect_db()) as db:
		with app.open_resource('schema.sql', mode='r') as f:
			db.cursor().executescript(f.read())
		db.commit()
	
@app.route('/highscores')
def high_scores():
	db = connect_db()
	cur = db.execute('select name, score from high_scores order by score desc limit 10')
	hs = [dict(name=row[0], score=row[1]) for row in cur.fetchall()]
	return json.dumps(hs)

@app.route('/add', methods=['POST'])
def add_entry():	
	db = connect_db()
	db.execute('insert into high_scores (name, score) values (?, ?)',
				[request.form['name'], request.form['score']])
	db.commit()
	return high_scores()
	
if __name__ == '__main__':
	app.run()

