-- Users table seeds here (Example)
INSERT INTO users (username, password, profile_picture)
VALUES ('Owen', 'password', 'http://www.messagescollection.com/wp-content/uploads/2015/04/cute-fb-profile-picture.jpg'),
('Thilakshan', 'password', 'http://www.messagescollection.com/wp-content/uploads/2015/04/cute-fb-profile-picture.jpg');

INSERT INTO matches (gametype)
VALUES ('goofspiel'),
('goofspiel'),('war'),('war'),('goofspiel'),('war');

INSERT INTO results (match_id, user_id, score, finished_position)
VALUES (1, 1, 20, 2),
(1, 2, 30, 1),
(2, 1, 90, 1),
(2, 2, 20, 2),
(3, 1, 90, 1),
(3, 2, 20, 2),
(4, 1, 90, 1),
(4, 2, 20, 2),
(5, 1, 90, 1),
(5, 2, 20, 2),
(6, 1, 90, 1),
(6, 2, 20, 2);

