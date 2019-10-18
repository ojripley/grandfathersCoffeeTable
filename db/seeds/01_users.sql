-- Users table seeds here (Example)
INSERT INTO users (username, password, profile_picture)
VALUES ('Owen', 'password', 'http://www.messagescollection.com/wp-content/uploads/2015/04/cute-fb-profile-picture.jpg'),
('Thilakshan', 'password', 'http://www.messagescollection.com/wp-content/uploads/2015/04/cute-fb-profile-picture.jpg');

INSERT INTO matches (gametype)
VALUES ('goofspiel'),
('goofspiel');

INSERT INTO results (match_id, user_id, score, finished_position)
VALUES (1, 1, 20, 2),
(1, 2, 30, 1),
(2, 1, 20, 2),
(2, 2, 30, 1);

