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
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};


/// Properties

const getAllProperties = (options, limit) => {
  let conditionString = '';
  let havingString = '';
  const queryParams = [limit];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id
  `;

  if (options.city) {
    if (queryParams.length > 1) {
      conditionString += ` AND `;
    }
    queryParams.push(`%${options.city}%`);
    conditionString += ` city LIKE $${queryParams.length}`;
  }

  if (options.minimum_price_per_night) {
    if (queryParams.length > 1) {
      conditionString += ` AND `;
    }
    queryParams.push(Number(`${options.minimum_price_per_night}`) * 100);
    conditionString += ` cost_per_night >= $${queryParams.length}`;
  }


  if (options.maximum_price_per_night) {
    if (queryParams.length > 1) {
      conditionString += ` AND `;
    }
    queryParams.push(Number(`${options.maximum_price_per_night}`) * 100);
    conditionString += ` cost_per_night <= $${queryParams.length}`;
  }

  if (conditionString.length > 0) {
    queryString += ` WHERE ${conditionString} GROUP BY properties.id`;
  } else {
    queryString += `GROUP BY properties.id`;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    havingString += ` HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  queryString += havingString + ` ORDER BY cost_per_night LIMIT $1;`;
  console.log(queryString);
  console.log(queryParams);
  return pool
    .query(queryString, queryParams)
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addProperty = (property) => {
  const queryString = `
  INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *;
  `;
  return pool
    .query(queryString, [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code])
    .then((data) => {
      console.log(data.rows[0]);
      return data.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
