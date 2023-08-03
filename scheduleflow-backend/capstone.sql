-- \echo 'Delete and recreate capstone db?'
-- \prompt 'Press return for yes or control-C for cancel > ' answer

DROP DATABASE IF EXISTS capstone;
CREATE DATABASE capstone;
\connect capstone;

\i capstone-schema.sql