INSERT IGNORE INTO students (id, first_name, last_name, email, phone_number, gender, department, semester, cgpa, date_of_birth, created_at, updated_at) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', 'Male', 'Computer Science', 3, 8.5, '2000-01-15', NOW(), NOW()),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Female', 'Information Technology', 5, 9.2, '1999-05-22', NOW(), NOW());
