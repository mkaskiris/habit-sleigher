CREATE TABLE user_table (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    usr_password VARCHAR(255)
);

CREATE TABLE habit (
    habit_id SERIAL PRIMARY KEY,
    habit VARCHAR(255),
    user_id INT,
    currTime timestamp DEFAULT CURRENT_timestamp,
    currFreq INTEGER,
    frequency INTEGER,
    FOREIGN KEY(user_id)
        REFERENCES user_table(user_id)
        ON DELETE SET NULL
);

-- DROP TABLE IF EXISTS habit_counter;
CREATE TABLE habit_counter (
    id serial PRIMARY KEY,
    habit_id int references habit(habit_id) ON DELETE CASCADE ON UPDATE CASCADE,
    time_done timestamp DEFAULT CURRENT_timestamp,
    finished boolean
);


INSERT INTO user_table(username, email, usr_password)
    VALUES
        ('test', 'test@gmail.com', '$2a$10$bSQ6V2lYWaTS.KH3K81De.Yvaf2RoNcZcU3BcsZqsdVirBvs.EkzS');


INSERT INTO habit (habit, user_id, currFreq, frequency) 
    VALUES 
        ('drink water', 1, 4, 4),
        ('drink waters', 1, 4, 4);


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
        (2, current_timestamp - INTERVAL '2 day', TRUE);


