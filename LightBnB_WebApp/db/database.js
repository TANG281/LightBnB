const properties = require("./json/properties.json");
const users = require("./json/users.json");

const dbParams = {
  user: 'labber',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
};
const { Pool } = require('pg');
const pool = new Pool(dbParams);

/// Users

const getUserWithEmail = (email) => {
  const queryString = `
  SELECT * FROM users
  WHERE email = $1;
  `;
  return pool
    .query(queryString, [email])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getUserWithId = (id) => {
  const queryString = `
  SELECT * FROM users
  WHERE id = $1;
  `;
  return pool
    .query(queryString, [id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUser = (inputs) => {
  const queryString = `
  INSERT INTO users (name, email, password)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;
  return pool
    .query(queryString, [inputs.name, inputs.email, inputs.password])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

const getAllReservations = (guest_id, limit = 10) => {
  const queryString = `
  SELECT * FROM reservations
  WHERE guest_id = $1
  LIMIT $2;
  `;
  return pool
    .query(queryString, [guest_id, limit])
    .then((data) => {
      console.log(data.rows);
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/// Properties

const getAllProperties = (options, limit = 10) => {
  const queryString = `
  SELECT * FROM properties
  LIMIT $1;
  `;
  return pool
    .query(queryString, [limit])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
