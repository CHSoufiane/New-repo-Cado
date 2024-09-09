import 'dotenv/config';
import { Sequelize } from 'sequelize';

// Create a new instance of Sequelize with the connection URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  define: {
    // Using snake_case instead of default camelCase
    underscored: true,
  },
  logging: false,
});

export default sequelize;