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
  section_days      VARCHAR(50),
  section_start_time        VARCHAR(100),
  section_end_time          VARCHAR(100),
  FOREIGN KEY (course_prefix, course_code) REFERENCES courses (course_prefix, course_code),
  CONSTRAINT section_key PRIMARY KEY (course_prefix, course_code, section_id)
);

CREATE TABLE labs (
  lab_id            VARCHAR(50) NOT NULL,
  section_id    VARCHAR(50) NOT NULL,
  course_prefix     VARCHAR(255) NOT NULL,
  course_code       VARCHAR(20) NOT NULL,
  lab_name          VARCHAR(50),
  lab_instructor    VARCHAR(100),
  term              VARCHAR(50),
  lab_days      VARCHAR(50),
  lab_start_time        VARCHAR(100),
  lab_end_time          VARCHAR(100),
  FOREIGN KEY (course_prefix, course_code, section_id) REFERENCES sections (course_prefix, course_code, section_id)
);