SELECT * FROM `drdo.`.demo;
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_for VARCHAR(255),
    highest_qualification VARCHAR(255),
    test_qualified VARCHAR(255),
    year_of_qualifying NET_GATE VARCHAR(4),
    work_experience TEXT,
    discipline_subject VARCHAR(255),
    full_name VARCHAR(255),
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    email VARCHAR(255),
    contact_numbers VARCHAR(255),
    category ENUM('General', 'OBC', 'SC', 'ST', 'PH'),
    present_address TEXT,
    additional_info TEXT
);

-- Create Qualifications table
CREATE TABLE IF NOT EXISTS Qualifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    qualification VARCHAR(255),
    board_university VARCHAR(255),
    year_of_passing YEAR,
    percentage_gpa DECIMAL(5, 2),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create WorkExperience table
CREATE TABLE IF NOT EXISTS WorkExperience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    post_name VARCHAR(255),
    organisation_details VARCHAR(255),
    location VARCHAR(255),
    from_date DATE,
    to_date DATE,
    nature_of_duties TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Publications table
CREATE TABLE IF NOT EXISTS Publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    authors VARCHAR(255),
    journal VARCHAR(255),
    volume VARCHAR(50),
    page_no VARCHAR(50),
    year YEAR,
    impact_factor DECIMAL(5, 2),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create Documents table
CREATE TABLE IF NOT EXISTS Documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    document_type ENUM('Image', '10 Marksheet', '12 Marksheet', 'Graduation', 'Post Graduation', 'PhD Marksheet', 'Resume', 'Signature'),
    file_path VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);