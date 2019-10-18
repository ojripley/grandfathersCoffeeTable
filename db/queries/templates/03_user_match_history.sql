SELECT matches.gametype, results.finished_position, results.score, matches.time_stamp
FROM users
JOIN results ON user_id = users.id
JOIN matches ON match_id = matches.id
WHERE users.id = 1
GROUP BY users.id, results.id, matches.id
ORDER BY matches.time_stamp;
