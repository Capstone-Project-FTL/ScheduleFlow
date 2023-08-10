DROP TABLE favorites;

CREATE TABLE favorites(
  userid BIGINT REFERENCES users(id) NOT NULL,
  favorite_name TEXT NOT NULL CONSTRAINT name_ckeck_length CHECK (char_length(favorite_name) > 0),
  favorite_schedule TEXT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT unique_combo UNIQUE (userid, favorite_schedule),
  PRIMARY KEY (userid, favorite_name, favorite_schedule)
);