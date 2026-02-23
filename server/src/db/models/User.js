import { DataTypes } from 'sequelize';
import sequelize from '../index.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] }
  },
  scopes: {
    withPassword: {
      attributes: {}
    }
  }
});

export default User;
