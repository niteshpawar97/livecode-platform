import { DataTypes } from 'sequelize';
import sequelize from '../index.js';
import User from './User.js';

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  updatedAt: false
});

User.hasMany(RefreshToken, { foreignKey: 'userId', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

export default RefreshToken;
