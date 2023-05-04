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
    name VARCHAR(30),
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
    name VARCHAR(30) NOT NULL,
    type VARCHAR(15) NOT NULL,
    `schema` VARCHAR(15) NOT NULL,
    status VARCHAR(15) NOT NULL,
    auth_id VARCHAR(100),
    auth_pass VARCHAR(100),
    date_created DATE DEFAULT (CURRENT_DATE)
);
CREATE TABLE job (
    job_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    type VARCHAR(15) NOT NULL,
    status VARCHAR(15) NOT NULL,
    src_path VARCHAR(50),
    src_platform INTEGER,
    dest_path VARCHAR(50),
    dest_platform INTEGER,
    date_created DATE DEFAULT (CURRENT_DATE),
    date_started DATE,
    date_finished DATE,
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
    job_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    name VARCHAR(30) NOT NULL,
    path VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    date_created DATE NOT NULL,
    date_modified DATE NOT NULL,
    date_ingested DATE NOT NULL,
    FOREIGN KEY fK_file_job (job_id) REFERENCES job(job_id),
    FOREIGN KEY fK_(platform_id) REFERENCES platform(platform_id)
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

INSERT INTO `group` (name, description)
VALUES ('admin', 'All Privileges');

INSERT INTO `user` (username, password)
VALUES ('admin', 'password');
