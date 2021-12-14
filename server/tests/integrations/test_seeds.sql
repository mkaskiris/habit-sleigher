TRUNCATE user_table, habit, habit_counter  RESTART IDENTITY;

INSERT INTO user_table(username, email, usr_password)
    VALUES
        ('test', 'test@gmail.com', '$2a$10$bSQ6V2lYWaTS.KH3K81De.Yvaf2RoNcZcU3BcsZqsdVirBvs.EkzS'),
        ('test2', 'test2@gmail.com', '$2a$10$A/5VanepDSivGz2NEfDdmuxDrJ.i7cHBznfus7sCFT41eOO5X1DQq');


INSERT INTO habit (habit, user_id, currTime, currFreq, frequency) 
    VALUES 
        ('drink water', 1, current_timestamp - INTERVAL '2 day', 4, 4),
        ('go running', 1, current_timestamp - INTERVAL '3 day', 4, 4),
        ('have breakfast', 1, current_timestamp - INTERVAL '1 day', 1, 1),
        ('have breakfast!', 2, current_timestamp - INTERVAL '1 day', 1, 1);


INSERT INTO habit_counter(habit_id, time_done)
    VALUES
        --completed task 1 4 times yesterday
        (1, current_timestamp - INTERVAL '1 day'),
        (1, current_timestamp - INTERVAL '1 day'),
        (1, current_timestamp - INTERVAL '1 day'),
        (1, current_timestamp - INTERVAL '1 day'),
        --completed task 1 4 times the day before
        (1, current_timestamp - INTERVAL '2 day'),
        (1, current_timestamp - INTERVAL '2 day'),
        (1, current_timestamp - INTERVAL '2 day'),
        (1, current_timestamp - INTERVAL '2 day'),
        --completed task 2 once today
        (2, current_timestamp),
        --completed task 2 4 times yesterday
        (2, current_timestamp - INTERVAL '1 day'),
        (2, current_timestamp - INTERVAL '1 day'),
        (2, current_timestamp - INTERVAL '1 day'),
        (2, current_timestamp - INTERVAL '1 day'),
        --completed task 2 3 times the day before
        (2, current_timestamp - INTERVAL '2 day'),
        (2, current_timestamp - INTERVAL '2 day'),
        (2, current_timestamp - INTERVAL '2 day'),
        --completed task 2 once 
        (2, current_timestamp - INTERVAL '3 day'),
        --completed task 3 once
        (3, current_timestamp - INTERVAL '1 day');
