CREATE TABLE `sms_responses` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`request_id` VARCHAR(128) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`to_phone` VARCHAR(20) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`from_sender` VARCHAR(64) NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`response_code` INT(11) NULL DEFAULT NULL,
	`response_message` TEXT NULL DEFAULT NULL COLLATE 'utf8mb4_general_ci',
	`createdat` TIMESTAMP NULL DEFAULT current_timestamp(),
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8mb4_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=10
;
