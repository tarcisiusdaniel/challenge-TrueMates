CREATE TABLE users (
    ID int NOT NULL AUTO_INCREMENT, 
    name varchar(255) UNIQUE, 
    email varchar(255) UNIQUE, 
    password varchar(250), 
    
    PRIMARY KEY (ID)
);

-- make sure to figure out how to store photos
CREATE TABLE posts (
    post_description text,
    post_timestamp timestamp, 
    user_id int NOT NULL, 
    ID SERIAL NOT NULL, 
    post_photos text[],
    
    PRIMARY KEY (ID), 
    
    CONSTRAINT fk_user_id
    FOREIGN KEY (user_id)
    REFERENCES users(ID)
);


