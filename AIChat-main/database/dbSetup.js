import "dotenv/config";
import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  // database: process.env.DATABASE,
}).promise();

const makeUser = `CREATE TABLE IF NOT EXISTS user (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    email_is_verified BOOLEAN,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_user PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

const makeChat = `CREATE TABLE IF NOT EXISTS chat (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    api_key VARCHAR(255) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    CONSTRAINT pk_chat PRIMARY KEY (id),
    CONSTRAINT fk_user_f FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

const makeFile = `CREATE TABLE IF NOT EXISTS file (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    size INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    chat_id INT,
    CONSTRAINT pk_file PRIMARY KEY (id),
    CONSTRAINT fk_user_f FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_f FOREIGN KEY (chat_id) REFERENCES chat (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

const setup = async () => {
  try {
    const [dbDel] = await pool.query("DROP DATABASE IF EXISTS aichat")
    const [dbResult] = await pool.query("CREATE DATABASE IF NOT EXISTS aichat;");
    const [dbUSE] = await pool.query("USE aichat;");
    console.log(dbResult, dbUSE)

    const [usersResult] = await pool.execute(makeUser);
    console.log("User table setup:", usersResult);

    const [chatResult] = await pool.execute(makeChat);
    console.log("Chat table setup:", chatResult);

    const [fileResult] = await pool.execute(makeFile);
    console.log("File table setup:", fileResult);

    console.log("DB SETUP OK");
  } catch (err) {
    console.error("Database setup error:", err);
  } finally {
    pool.end();
    console.log("Database pool closed.");
  }
};

setup();
