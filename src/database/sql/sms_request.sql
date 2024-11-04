CREATE TABLE `sms_requests` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`user` VARCHAR(255) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`request_id` VARCHAR(128) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`to_phone` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`from_sender` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`msg` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`msgtype` INT(11) NULL DEFAULT '0',
	`enable_msg_id` INT(11) NULL DEFAULT '1',
	`createdat` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=10
;
