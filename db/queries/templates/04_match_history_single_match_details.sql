SELECT users.username, results.finished_position AS placing, results.score
FROM results
JOIN users ON (users.id = results.user_id)
JOIN matches ON (matches.id = results.match_id)
WHERE matches.id=2-- Change this based on the match selected
ORDER BY results.finished_position
