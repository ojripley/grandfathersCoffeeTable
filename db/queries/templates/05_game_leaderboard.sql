SELECT users.username, sum(results.score) as users_total_game_score
FROM users
JOIN results ON user_id = users.id
JOIN matches ON match_id = matches.id
WHERE matches.gametype = 'war'
GROUP BY users.username
ORDER BY users_total_game_score desc
LIMIT 10;
