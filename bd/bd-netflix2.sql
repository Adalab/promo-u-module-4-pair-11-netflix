SELECT * FROM newnetflix.actors;
select * FROM  actors WHERE birthday > '1950-01-01' AND birthday < '1960-01-01';
select name, lastname  FROM  actors WHERE country = 'Estados Unidos';
ALTER TABLE actors ADD imagen varchar(60);


ALTER TABLE rel_movies_users ADD score INT;
SELECT * FROM rel_movies_users