CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255),
    profile_picture VARCHAR(255), 
    date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT UNIQUE (email),
    CONSTRAINT UNIQUE (username)
);


CREATE TABLE movie_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    idMovieDb INT NOT NULL,
    CONSTRAINT UNIQUE (category_name)
);

CREATE TABLE user_favorite_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES movie_categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE user_favorite_movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idMovieDb INT NOT NULL,
    title VARCHAR(255) NOT NULL, 
    poster VARCHAR(255) NOT NULL,
    release_date VARCHAR(255) NOT NULL,
    rating_count INT NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL ,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE email_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verification_code VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);