INSERT INTO platform (name, type, `schema`, status)
          VALUES ('test', 'platform', 'file', 'active');

DELETE FROM platform
WHERE name='test'