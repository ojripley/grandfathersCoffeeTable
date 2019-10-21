INSERT INTO matches(gametype)
VALUES('goofspiel')
RETURNING id;


INSERT INTO results(match_id, user_id, score, finished_position)
VALUES(8, 1, 200, 1),

