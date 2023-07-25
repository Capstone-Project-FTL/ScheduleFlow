CREATE DATABASE capstone;

CREATE TABLE courses (
  course_prefix    VARCHAR(255) NOT NULL,
  course_code      VARCHAR(20) NOT NULL,
  term             VARCHAR(50),
  course_description TEXT,
  CONSTRAINT course_id PRIMARY KEY (course_prefix, course_code)
);

CREATE TABLE sections (
  section_id    VARCHAR(50) NOT NULL,
  course_prefix     VARCHAR(255) NOT NULL,
  course_code       VARCHAR(20) NOT NULL,
  instructor        VARCHAR(100),
  term              VARCHAR(50),
  days_of_week      VARCHAR(50),
  start_time        TIME,
  end_time          TIME,
  FOREIGN KEY (course_prefix, course_code) REFERENCES courses (course_prefix, course_code),
  CONSTRAINT section_key PRIMARY KEY (course_prefix, course_code, section_id)
);

CREATE TABLE labs (
  lab_id            INT NOT NULL,
  section_id    VARCHAR(50) NOT NULL,
  course_prefix     VARCHAR(255) NOT NULL,
  course_code       VARCHAR(20) NOT NULL,
  lab_name          VARCHAR(50),
  lab_instructor    VARCHAR(100),
  term              VARCHAR(50),
  days_of_week      VARCHAR(50),
  start_time        TIME,
  end_time          TIME,
  FOREIGN KEY (course_prefix, course_code, section_id) REFERENCES sections (course_prefix, course_code, section_id)
);
-- CREATE TABLE users (
--     id              SERIAL PRIMARY KEY,
--     email           VARCHAR(255) NOT NULL UNIQUE CHECK (POSITION('@' IN email) > 1),
--     username        VARCHAR(255) NOT NULL,
--     first_name      VARCHAR(255) NOT NULL,
--     last_name       VARCHAR(255) NOT NULL,
--     password        VARCHAR(255) NOT NULL,
--     created_at      TIMESTAMP NOT NULL DEFAULT NOW()
--     );

    -- CREATE TABLE universities (
    -- id              SERIAL PRIMARY KEY,
    -- name            VARCHAR(255),
    -- subjects        VARCHAR(255)
    -- );

    -- CREATE TABLE courses (
    -- id              VARCHAR(255),
    -- name            VARCHAR(255),
    -- number          VARCHAR(255)
    -- );

    -- CREATE TABLE sections (
    -- id              SERIAL PRIMARY KEY,
    -- number          VARCHAR(255) NOT NULL,
    -- days            VARCHAR(255) NOT NULL,
    -- time            VARCHAR(255) NOT NULL,
    -- room            VARCHAR(255) NOT NULL,
    -- instructor      VARCHAR(255) NOT NULL,
    -- has_lab         VARCHAR(255) NOT NULL,
    -- labs            VARCHAR(255) NOT NULL,
    -- seats           VARCHAR(255) NOT NULL,
    -- rating          VARCHAR(255) NOT NULL
    -- );

    -- CREATE TABLE labs (
    -- id              SERIAL PRIMARY KEY,
    -- course          VARCHAR(255)

    -- );