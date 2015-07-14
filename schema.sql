drop table if exists high_scores;
create table high_scores (
	id integer primary key autoincrement,
	name text not null,
	score integer not null
);