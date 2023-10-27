-- Creation of table

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, apikey TEXT)
CREATE TABLE IF NOT EXISTS deviceinfo (device_id INTEGER PRIMARY KEY, device_name TEXT, device_status BOOLEAN)
CREATE TABLE IF NOT EXISTS devicelogger (id INTEGER,device_id INTEGER device_status BOOLEAN, creation_date datetime)

-- Insert Query

INSERT INTO users (id, name, apikey) VALUES (1, 'Avinash Joshi', 'dff871a4-7416-11ee-b962-0242ac120002');
INSERT INTO deviceinfo (device_id, device_name, device_status) VALUES (1, 'WMS-Ardunio', TRUE);
INSERT INTO devicelogger (id, device_id, device_status, creation_date) VALUES (1, 1, TRUE, '2023-10-26 15:15:30');
INSERT INTO devicelogger (device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES (123, '2023-10-27', true, '13:42:56', '14:00:00');
INSERT INTO devicelogger (id, device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES (default, 123, '2023-10-27', true, '13:42:56', '14:00:00');
