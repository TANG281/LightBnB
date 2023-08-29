SELECT reservations.id, title, start_date, cost_per_night, avg(rating) as average_rating
FROM reservations
JOIN properties ON properties.id = reservations.property_id
JOIN property_reviews ON reservations.property_id = property_reviews.property_id
WHERE reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY reservations.start_date
LIMIT 10;

