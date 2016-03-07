ALTER TABLE `agenda` DROP FOREIGN KEY `agenda_ibfk_1`;
ALTER TABLE `agenda` CHANGE `trainer_id` `trainer_id` INT(11) NULL;
ALTER TABLE `agenda` CHANGE `event_edition` `event_edition` INT(11) NULL;
ALTER TABLE `agenda` ADD `path_id` INT(11) NOT NULL AFTER `description`;

CREATE TABLE `paths` ( 
	`id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	`name` varchar(200) NOT NULL,
	`event_edition` int(11) NOT NULL,
	FOREIGN KEY (event_edition) REFERENCES event_editions(id)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `agenda`
ADD FOREIGN KEY (path_id)
REFERENCES paths(id);