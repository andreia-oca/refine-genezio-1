import pg from 'pg'

export async function init(pool: pg.Pool) {
    await pool.query(
        "CREATE TABLE IF NOT EXISTS categories (id serial PRIMARY KEY, title VARCHAR(255))"
    );

    await pool.query(
        "CREATE TABLE IF NOT EXISTS authors (id serial PRIMARY KEY, name VARCHAR(255))"
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS blog_posts (
          id serial PRIMARY KEY,
          title VARCHAR(255),
          content TEXT,
          author_id INT,
          status VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      );
  
    await pool.query(
        `CREATE TABLE IF NOT EXISTS blog_post_categories (
            blog_post_id INT NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
            category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE
        )`
    );
}