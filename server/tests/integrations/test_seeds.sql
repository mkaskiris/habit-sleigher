TRUNCATE user_table, habit, habit_counter  RESTART IDENTITY;

INSERT INTO user_table(username, email, usr_password)
    VALUES
        ('test', 'test1@gmail.com', '$2a$10$bSQ6V2lYWaTS.KH3K81De.Yvaf2RoNcZcU3BcsZqsdVirBvs.EkzS'),
        ('test2', 'test2@hotmail.com', ''),
        ('test3', 'test3@test.com', '');

INSERT INTO habit (habit, user_id, currTime, currFreq, frequency) 
    VALUES 
        ('test1', 1, current_timestamp - INTERVAL '2 day', 4, 4),
        ('test2', 1, current_timestamp - INTERVAL '3 day', 4, 4),
        ('test3', 1, current_timestamp - INTERVAL '1 day', 1, 1),

        ('test1', 2, current_timestamp - INTERVAL '2 day', 1, 5),
        ('test2', 2, current_timestamp - INTERVAL '3 day', 0, 2),
        ('test3', 2, current_timestamp - INTERVAL '1 day', 2, 4);
        
INSERT INTO habit_counter(habit_id, time_done, completedStreak)
    VALUES
        --completed task 1 4 times yesterday
        (1, current_timestamp - INTERVAL '1 day', FALSE),
        (1, current_timestamp - INTERVAL '1 day', FALSE),
        (1, current_timestamp - INTERVAL '1 day', FALSE),
        (1, current_timestamp - INTERVAL '1 day', TRUE),
        --completed task 1 4 times the day before
        (1, current_timestamp - INTERVAL '2 day', FALSE),
        (1, current_timestamp - INTERVAL '2 day', FALSE),
        (1, current_timestamp - INTERVAL '2 day', FALSE),
        --completed task 2 once today
        (2, current_timestamp, FALSE),
        (2, current_timestamp, FALSE),
        --completed task 2 4 times yesterday
        (2, current_timestamp - INTERVAL '1 day', FALSE),
        (2, current_timestamp - INTERVAL '1 day', FALSE),
        (2, current_timestamp - INTERVAL '1 day', FALSE),
        (2, current_timestamp - INTERVAL '1 day', TRUE),
        --completed task 2 3 times the day before
        (2, current_timestamp - INTERVAL '2 day', FALSE),
        (2, current_timestamp - INTERVAL '2 day', FALSE),
        (2, current_timestamp - INTERVAL '2 day', FALSE),
        --completed task 2 once 
        (2, current_timestamp - INTERVAL '3 day', FALSE),
        --completed task 3 once
        (3, current_timestamp - INTERVAL '1 day', TRUE);