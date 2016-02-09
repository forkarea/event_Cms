CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(32) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(60) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(32) NOT NULL,
  `last_login` datetime DEFAULT NULL,
  `role` varchar(1) DEFAULT NULL,
  `session_id` varchar(256) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `event_editions` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`number` int(11) NOT NULL UNIQUE,
	`name` varchar(150) NOT NULL,
	`start_date` date NOT NULL,
	`stop_date` date NOT NULL,
	`visibility` int(1) NOT NULL
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `trainers` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`first_name` varchar(100) NOT NULL,
	`last_name` varchar(100) NOT NULL,
	`description` varchar(3000) NULL,
	`experience` varchar(2000) NULL,
	`event_edition` int(11) NOT NULL,
	`photo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `agenda` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(150) NOT NULL,
	`start_date` date NOT NULL,
	`start_time` time NOT NULL,
	`stop_date` date NOT NULL,
	`stop_time` time NOT NULL,
	`trainer_id` int(11) NOT NULL,
	`event_edition` int(11) NOT NULL,
	`description` varchar(3000) NOT NULL,
	FOREIGN KEY (trainer_id) REFERENCES trainers(id),
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `media_partners_dictionary` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(100) NOT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partners_dictionary` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(100) NOT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `partners` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(200) NOT NULL,
	`www` varchar(150) DEFAULT NULL,
	`fb` varchar(100) DEFAULT NULL,
	`description` varchar(3000) DEFAULT NULL,
	`type_id` int(11) NOT NULL,
	`event_edition` int(11) NOT NULL,
	`logo` varchar(250) DEFAULT NULL,
	FOREIGN KEY (type_id) REFERENCES partners_dictionary(id),
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `media_partners` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(200) NOT NULL,
	`www` varchar(150) DEFAULT NULL,
	`fb` varchar(100) DEFAULT NULL,
	`description` varchar(2000) DEFAULT NULL,
	`type_id` int(11) NOT NULL,
	`event_edition` int(11) NOT NULL,
	`logo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (type_id) REFERENCES media_partners_dictionary(id),
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `news` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`title` varchar(200) NOT NULL,
	`date` date NOT NULL,
	`content` varchar(5000) NOT NULL,
	`priority` int(1) NOT NULL,
	`event_edition` int(11) NOT NULL,
	`photo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `menu` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(50) NOT NULL,
	`public_name` varchar(50) NOT NULL,
	`position` int(2) NOT NULL,
	`visibility` int(1) NOT NULL,
	`title` varchar(150) NOT NULL,
	`url` varchar(100) NOT NULL,
	`source` varchar(100) NOT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `report` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`content` MEDIUMTEXT DEFAULT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
CREATE TABLE `organizers` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`content` MEDIUMTEXT DEFAULT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `report_photos` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`event_edition` int(11) NOT NULL,
	`photo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
CREATE TABLE `organizers_photos` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`event_edition` int(11) NOT NULL,
	`photo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
CREATE TABLE `description` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`content` MEDIUMTEXT DEFAULT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
CREATE TABLE `description_photos` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`event_edition` int(11) NOT NULL,
	`photo` varchar(150) DEFAULT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
