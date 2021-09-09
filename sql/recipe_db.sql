DROP TABLE IF EXISTS tags_items;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS recipe_items;
DROP TABLE IF EXISTS shopping_items;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS items;


CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(200) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes(
    id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(200) NOT NULL UNIQUE,
    recipe_preparation TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipe_items(
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shopping_items(
    id SERIAL PRIMARY KEY,
    item_id INT NOT NULL UNIQUE REFERENCES items(id) ON DELETE CASCADE,
    checked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    tag_name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE tags_items(
    id SERIAL PRIMARY KEY,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    shopping_item_id INT REFERENCES items(id) ON DELETE CASCADE,
    recipe_id INT REFERENCES recipes(id) ON DELETE CASCADE
);

-- INSERT INTO items (item_name) VALUES ('Salz');
-- INSERT INTO items (item_name) VALUES ('Pfeffer');
-- INSERT INTO items (item_name) VALUES ('Tomaten, passiert');
-- INSERT INTO items (item_name) VALUES ('Hefe');
-- INSERT INTO items (item_name) VALUES ('Mehl, 00');
-- INSERT INTO items (item_name) VALUES ('Olivenöl');
-- INSERT INTO items (item_name) VALUES ('Wasser');



-- INSERT INTO recipes (recipe_name, recipe_preparation) VALUES ('Pizza', '1. Teig ausbreiten \n 2. Teig bestreichen');

-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,7);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,6);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,5);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,4);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,3);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,2);
-- INSERT INTO recipe_items (recipe_id, item_id) VALUES (1,1);

-- INSERT INTO shopping_items (item_id) VALUES (4);
-- INSERT INTO shopping_items (item_id) VALUES (5);
-- INSERT INTO shopping_items (item_id) VALUES (6);
-- INSERT INTO shopping_items (item_id) VALUES (3);

