import { Sequelize } from 'sequelize';
import { DB_CONFIG } from '../config/index.js';

const sequelize = new Sequelize(
  DB_CONFIG.database,
  DB_CONFIG.username,
  DB_CONFIG.password,
  {
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    dialect: DB_CONFIG.dialect,
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    await sequelize.sync();
    console.log('Database models synchronized.');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
}

export default sequelize;
