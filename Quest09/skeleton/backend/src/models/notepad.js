import { Model, DataTypes } from "sequelize";
import { sequelize } from "./dbInit";

class Notepads extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  static associate(models) {
    // define association here
  }
};
Notepads.init({
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    type: DataTypes.STRING
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING
  },
  content: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Notepad',
  timestamps: false,
});

export default Notepads;