CREATE TABLE user (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(30),
    password VARCHAR(30) NOT NULL,
    name VARCHAR(30),
    oauth_id VARCHAR(30)
);

CREATE TABLE group (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    description VARCHAR(50),
);

CREATE TABLE user_group (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (group_id) REFERENCES group(id),
);

CREATE TABLE file (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    job_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    name VARCHAR(30) NOT NULL,
    path VARCHAR(50) NOT NULL,
    size INTEGER NOT NULL,
    date_created DATE NOT NULL,
    date_modified DATE NOT NULL,
    date_ingested DATE NOT NULL,
    FOREGIN KEY (job_id) REFERENCES job(id),
    FOREGIN KEY (platform_id) REFERENCES platform(id),
);

CREATE TABLE file_group (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    file_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (file_id) REFERENCES file(id),
    FOREIGN KEY (group_id) REFERENCES group(id),
);

CREATE TABLE platform (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    type VARCHAR(15) NOT NULL,
    schema VARCHAR(15) NOT NULL,
    status VARCHAR(15) NOT NULL,
    auth_id VARCHAR(100),
    auth_pass VARCHAR(100),
    date_created DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE file_platform (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    file_id INTEGER NOT NULL,
    platform_id INTEGER NOT NULL,
    FOREIGN KEY (file_id) REFERENCES file(id),
    FOREIGN KEY (platform_id) REFERENCES platform(id),
);

CREATE TABLE job_group (
    id INTEGER PRIMARY KEY NOT NULL AUTO_INCREMENT,
    job_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    FOREIGN KEY (job_id) REFERENCES job(id),
    FOREIGN KEY (group_id) REFERENCES group(id),
);

CREATE TABLE job (
    id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    type VARCHAR(15) NOT NULL,
    status VARCHAR(15) NOT NULL,
    src_path VARCHAR(50),
    src_platform INTEGER,
    dest_path VARCHAR(50),
    dest_platform INTEGER,
    date_created DATE DEFAULT (CURRENT_DATE)
    date_started DATE,
    date_finished DATE,
    FOREIGN KEY (src_platform) REFERENCES platform(id),
    FOREIGN KEY (dest_platform) REFERENCES platform(id),
);

