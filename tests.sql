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

CREATE VIEW user_group_info AS
SELECT u.user_id, u.username, u.password, ug.user_group_id, g.group_id, g.name as group_name, g.description as group_description
FROM user u
INNER JOIN user_group ug on u.user_id = ug.user_id
INNER JOIN `group` g on ug.group_id = g.group_id;

CREATE VIEW group_user_info AS
SELECT g.group_id, g.name, g.description, ug.user_group_id, u.user_id, u.username as user_username, u.password as user_password
FROM `group` g
INNER JOIN user_group ug on g.group_id = ug.group_id
INNER JOIN user u on ug.user_id = u.user_id;

