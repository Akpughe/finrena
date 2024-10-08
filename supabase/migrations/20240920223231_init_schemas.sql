CREATE TABLE categories (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE products (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    website_url VARCHAR(255),
    logo_url VARCHAR(255)
);

CREATE TABLE features (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE product_feature_values (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id),
    feature_id INT NOT NULL REFERENCES features(id),
    value TEXT
);

CREATE TABLE comparison_metrics (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_id INT NOT NULL REFERENCES categories(id),
    feature_id INT NOT NULL REFERENCES features(id)
);
