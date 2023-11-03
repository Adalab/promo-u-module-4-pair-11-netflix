SELECT * FROM newnetflix.actors;
select * FROM  actors WHERE birthday > '1950-01-01' AND birthday < '1960-01-01';
select name, lastname  FROM  actors WHERE country = 'Estados Unidos';
ALTER TABLE actors ADD imagen varchar(60);


ALTER TABLE rel_movies_users ADD score INT;
SELECT * FROM rel_movies_users;

SELECT * FROM movies;
INSERT INTO movies (title, genre, image, category, year)
VALUE ('gambita de dama', 'drama', 'https://localhost:4000/gambita-de-dama.jpg', 'top 10', 2020);

INSERT INTO movies (title, genre, image, category, year)
VALUE ('friends', 'comedia', 'https://localhost:4000/friends.jpg', 'top 10', 1994)

UPDATE `newnetflix`.`movies` SET `image` = 'http://localhost:4000/gambita-de-dama.jpg' WHERE (`idMovies` = '4');
UPDATE `newnetflix`.`movies` SET `image` = 'http://localhost:4000/friends.jpg' WHERE (`idMovies` = '5');

SELECT genre FROM movies