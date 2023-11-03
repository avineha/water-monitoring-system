-- Creation of table

CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, apikey TEXT)
CREATE TABLE IF NOT EXISTS devicelogger (id INTEGER,device_id INTEGER device_status BOOLEAN, creation_date datetime)
CREATE TABLE "deviceinfo" (
	"device_id"	INTEGER,
	"device_name"	TEXT,
	"device_status"	BOOLEAN,
	"device_starttime"	TEXT,
	"device_running_feq"	INTEGER,
   PRIMARY KEY("device_id")
)
-- Insert Query

INSERT INTO users (id, name, apikey) VALUES (1, 'Avinash Joshi', 'dff871a4-7416-11ee-b962-0242ac120002');
INSERT INTO deviceinfo (device_id, device_name, device_status,device_starttime,device_running_feq) VALUES (1, 'WMS-Ardunio', TRUE,"8:00",3600);
INSERT INTO devicelogger (id, device_id, device_status, creation_date) VALUES (1, 1, TRUE, '2023-10-26 15:15:30');
INSERT INTO devicelogger (device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES (123, '2023-10-27', true, '13:42:56', '14:00:00');
INSERT INTO devicelogger (id, device_id, creation_date, device_status, device_starttime, device_stoptime) VALUES (default, 123, '2023-10-27', true, '13:42:56', '14:00:00');

update deviceinfo set device_star_hour=13,device_star_min =39

update deviceinfo
set device_star_hour=21,
device_star_min =40,
device_running_feq=20