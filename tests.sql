INSERT INTO platform (name, type, `schema`, status)
          VALUES ('test', 'platform', 'file', 'active');

DELETE FROM platform
WHERE name='test'

UPDATE platform
SET `name` = 'changed',
    `type`= 'changed',
    `schema` = 'changed',
    `status` = 'changed'
WHERE platform_id = 1;

SELECT *
FROM `group`;

CREATE VIEW user_group_info AS;

INSERT INTO user_group (user_id, group_id)
    VALUES (1, 3);

DROP VIEW user_group_info;

CREATE VIEW user_group_info AS
SELECT u.user_id, u.username, u.password, ug.user_group_id, g.group_id, g.name as group_name, g.description as group_description
FROM user u
LEFT JOIN user_group ug on u.user_id = ug.user_id
LEFT JOIN `group` g on ug.group_id = g.group_id;

SELECT u.user_id, u.username, u.password, ug.user_group_id, g.group_id, g.name as group_name, g.description as group_description
FROM user u
LEFT JOIN user_group ug on u.user_id = ug.user_id
LEFT JOIN `group` g on ug.group_id = g.group_id;

INSERT INTO user (username, `password`)
    VALUES ('bob', 'asd');

CREATE VIEW group_user_info AS
SELECT g.group_id, g.name, g.description, ug.user_group_id, u.user_id, u.username as user_username, u.password as user_password
FROM `group` g
INNER JOIN user_group ug on g.group_id = ug.group_id
INNER JOIN user u on ug.user_id = u.user_id;

SELECT *
FROM user;

INSERT INTO job (name, type, status, src_path, src_platform, date_started, date_finished)
VALUES ('test', 'local', 'finished', 'D:/Media', 18, '2019-07-07T07:48:07', '2019-07-07T07:48:07');

INSERT INTO file_group (file_id, group_id) VALUES (1, 18);

INSERT INTO file_platform (file_id, platform_id)  VALUES ('Test Platform', 'This is a test platform.', @group_id);

INSERT INTO `file` (job_id, platform_id, name, path, size, date_created, date_modified, date_ingested)
    VALUES (9, 18, 'Test File', 'D/File/Path', 1500, '2019-07-07T07:48:07', '2019-07-07T07:48:07', NOW());

INSERT INTO job (name, type, status, src_path, src_platform, date_started, date_finished)
VALUES ('test', 'local', 'finished', 'D:/Media', 1, '2019-07-07T07:48:07', '2019-07-07T07:48:07');

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
        VALUES (in_name, in_path, in_extension, in_size, in_date_created, in_date_modified, CURRENT_TIMESTAMP()) ESCAPE '';

    SELECT LAST_INSERT_ID() INTO @file_id;
    SELECT @file_id;

    INSERT INTO file_job (file_id, job_id)
        VALUES (@file_id, in_job_id);

    INSERT INTO file_platform (file_id, platform_id)
        VALUES (@file_id, in_platform_id);

    INSERT INTO file_group (file_id, group_id)
        VALUES (@file_id, in_group_id);
END $$

CALL insert_file(1, 1, 1, 'Test File', 'D:\\Media\\Photos\\Humans\\Kai Pics', '.jpeg', 1500, '2019-07-07T07:48:07', '2019-07-07T07:48:07');

DROP PROCEDURE insert_file;

CREATE VIEW file_meta AS
    SELECT file_id, name, path, extension, size, date_created, date_modified, date_ingested
    FROM file;