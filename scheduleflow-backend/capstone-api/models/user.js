const db = require("../database");
const {BadRequestError} = require("../utils/errors");
const bcrypt = require("bcrypt");
require("dotenv").config();
require("colors");

const UserSchema = {
  id: Number,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  school: String,
};

class User {
  // from https://stackoverflow.com/a/46181
  static #isValidEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  static async fetchUserByEmail(email) {
    const query = "SELECT * from users WHERE email=$1;";
    return await db.query(query, [email.toLowerCase()]);
  }

  static async register(user) {
    // if passwords do not match
    if (user.password !== user.confirmPassword) {
      throw new BadRequestError("passwords do not match");
    }

    // if email is invalid
    if (!this.#isValidEmail(user.email)) {
      throw new BadRequestError("email is invalid");
    }

    const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPT_WORK_FACTOR));
    const hashedPassword = bcrypt.hashSync(user.password, salt);

    const query =
      "INSERT INTO users (email, password, first_name, last_name, school) values ($1, $2, $3, $4, $5) RETURNING *;";
    const result = await db.query(query, [
      user.email.toLowerCase(),
      hashedPassword,
      user.firstName,
      user.lastName,
      user.school,
    ]);
    const newUser = result.rows[0];
    delete newUser.password;
    return newUser;
  }

  static async login(user){
    const result = await this.fetchUserByEmail(user.email);
    // if we were unable to fetch from the database
    if (!result) {
      throw new BadRequestError("an error occured", statusCode=501);
    }
    // if there is no matching email
    if (result.rowCount === 0) {
      throw new UnauthorizedError("email does not exist");
    }
    const foundUser = result.rows[0]
    // if the password does match
    if (await bcrypt.compare(user.password, foundUser.password)) {
      return foundUser
    } else {
      throw new BadRequestError("email and password does not match");
    }
  }
}

module.exports = User;
