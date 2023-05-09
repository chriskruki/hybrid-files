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
