DROP SCHEMA IF EXISTS hybridfiles;
CREATE SCHEMA hybridfiles;
USE hybridfiles;
CREATE TABLE `user` (
    user_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    username VARCHAR(30),
    password VARCHAR(30) NOT NULL
);
CREATE TABLE `group` (
    group_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30),
    description VARCHAR(50)
);
CREATE TABLE user_group (
    user_group_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES `user`(user_id),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
);
CREATE TABLE platform (
    platform_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `type` VARCHAR(15) NOT NULL,
    `schema` VARCHAR(15) NOT NULL,
    `status` VARCHAR(15) NOT NULL,
    auth_id VARCHAR(100),
    auth_pass VARCHAR(100),
    date_created TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);
CREATE TABLE job (
    job_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `type` VARCHAR(15) NOT NULL,
    `status` VARCHAR(15) NOT NULL,
    src_path VARCHAR(255),
    src_platform INTEGER,
    dest_path VARCHAR(255),
    dest_platform INTEGER,
    date_created TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
    date_started TIMESTAMP,
    date_finished TIMESTAMP,
    FOREIGN KEY (src_platform) REFERENCES platform(platform_id),
    FOREIGN KEY (dest_platform) REFERENCES platform(platform_id)
);
CREATE TABLE job_group (
    job_group_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    job_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (job_id) REFERENCES job(job_id),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
);
CREATE TABLE `file` (
    file_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    extension VARCHAR(255) NOT NULL,
    size INTEGER NOT NULL,
    date_created TIMESTAMP NOT NULL,
    date_modified TIMESTAMP NOT NULL,
    date_ingested TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);
CREATE TABLE file_platform (
    file_platform_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    file_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    FOREIGN KEY (file_id) REFERENCES `file`(file_id),
    FOREIGN KEY (platform_id) REFERENCES platform(platform_id)
);
CREATE TABLE file_group (
    file_group_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    file_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (file_id) REFERENCES `file`(file_id),
    FOREIGN KEY (group_id) REFERENCES `group`(group_id)
);
CREATE TABLE file_job (
    file_job_id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    file_id INTEGER NOT NULL,
    job_id INTEGER NOT NULL,
    FOREIGN KEY (file_id) REFERENCES `file`(file_id),
    FOREIGN KEY (job_id) REFERENCES job(job_id)
);

-- Seed admin group and user
INSERT INTO `group` (name, description)
VALUES ('admin', 'All Privileges');
INSERT INTO `user` (username, password)
VALUES ('admin', 'password');
INSERT INTO user_group (user_id, group_id)
VALUES (1, 1);
INSERT INTO platform (`name`, `type`, `schema`, `status`)
VALUES ('file', 'local', 'file', 'active');

CREATE VIEW user_group_info AS
SELECT u.user_id,
    u.username,
    u.password,
    ug.user_group_id,
    g.group_id,
    g.name as group_name,
    g.description as group_description
FROM user u
    LEFT JOIN user_group ug on u.user_id = ug.user_id
    LEFT JOIN `group` g on ug.group_id = g.group_id;

CREATE VIEW group_user_info AS
SELECT g.group_id,
    g.name,
    g.description,
    ug.user_group_id,
    u.user_id,
    u.username as user_username,
    u.password as user_password
FROM `group` g
    INNER JOIN user_group ug on g.group_id = ug.group_id
    INNER JOIN user u on ug.user_id = u.user_id;


-- Insert file stored procedure
DELIMITER $$
CREATE PROCEDURE insert_file (
    IN in_job_id INT,
    IN in_platform_id INT,
    IN in_group_id INT,
    IN in_name VARCHAR(255),
    IN in_path VARCHAR(255),
    IN in_extension VARCHAR(255),
    IN in_size INT,
    IN in_date_created TIMESTAMP,
    IN in_date_modified TIMESTAMP
)
BEGIN
    INSERT INTO `file` (name, path, extension, size, date_created, date_modified, date_ingested)
        VALUES (in_name, in_path, in_extension, in_size, in_date_created, in_date_modified, CURRENT_TIMESTAMP());

    SELECT LAST_INSERT_ID() INTO @file_id;
    SELECT @file_id;

    INSERT INTO file_job (file_id, job_id)
        VALUES (@file_id, in_job_id);

    INSERT INTO file_platform (file_id, platform_id)
        VALUES (@file_id, in_platform_id);

    INSERT INTO file_group (file_id, group_id)
        VALUES (@file_id, in_group_id);
END$$