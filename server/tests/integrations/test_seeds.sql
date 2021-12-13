TRUNCATE user_table, habit, habit_counter  RESTART IDENTITY;

INSERT INTO user_table(username, email, usr_password)
    VALUES
        ('test', 'test@gmail.com', '$2a$10$bSQ6V2lYWaTS.KH3K81De.Yvaf2RoNcZcU3BcsZqsdVirBvs.EkzS'),
        ('test2', 'test@hotmail.com', ''),
        ('test3', 'test@test.com', '');

INSERT INTO habit (habit, user_id, currTime, currFreq, frequency) 
    VALUES 
        ('test1', 1, current_timestamp - INTERVAL '2 day', 4, 4),
        ('test2', 1, current_timestamp - INTERVAL '3 day', 4, 4),
        ('test3', 1, current_timestamp - INTERVAL '1 day', 1, 1);

        ('test1', 2, current_timestamp - INTERVAL '2 day', 1, 5),
        ('test2', 2, current_timestamp - INTERVAL '3 day', 0, 2),
        ('test3', 2, current_timestamp - INTERVAL '1 day', 2, 4);

        


INSERT INTO habit_counter(habit_id, time_done, finished)
    VALUES
        (1, current_timestamp - INTERVAL '1 day', TRUE),
        (1, current_timestamp - INTERVAL '1 day', TRUE),
        (1, current_timestamp - INTERVAL '1 day', TRUE),
        (1, current_timestamp - INTERVAL '1 day', TRUE),
        (1, current_timestamp - INTERVAL '2 day', TRUE),
        (1, current_timestamp - INTERVAL '2 day', TRUE),
        (1, current_timestamp - INTERVAL '2 day', TRUE),
        (1, current_timestamp - INTERVAL '2 day', TRUE),

        (2, current_timestamp, TRUE),
        (2, current_timestamp - INTERVAL '1 day', TRUE),
        (2, current_timestamp - INTERVAL '1 day', TRUE),
        (2, current_timestamp - INTERVAL '1 day', TRUE),
        (2, current_timestamp - INTERVAL '1 day', TRUE),
        (2, current_timestamp - INTERVAL '2 day', TRUE),
        (2, current_timestamp - INTERVAL '2 day', TRUE),
        (2, current_timestamp - INTERVAL '2 day', TRUE),
        (2, current_timestamp - INTERVAL '3 day', TRUE),

        (3, current_timestamp - INTERVAL '1 day', TRUE);
