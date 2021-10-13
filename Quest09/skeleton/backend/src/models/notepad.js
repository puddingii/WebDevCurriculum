import { Model, DataTypes } from "sequelize";
import { sequelize } from "./dbInit";

class Notepad extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */

  static associate(models) {
    // define association here
  }
};
Notepad.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING
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

export default Notepad;