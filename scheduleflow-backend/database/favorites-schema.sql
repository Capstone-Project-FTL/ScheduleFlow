DROP TABLE favorites;

CREATE TABLE favorites(
  userid BIGINT REFERENCES users(id) NOT NULL,
  favorite_schedule TEXT NOT NULL,
  added_at DATE DEFAULT CURRENT_DATE NOT NULL,
  PRIMARY KEY (userid, favorite_schedule)
);