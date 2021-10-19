import { Model, DataTypes } from "sequelize";
import { sequelize } from "./dbInit";

class Users extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  getId() {
    return this.id;
  }
  getOpentab() {
    return this.opentab;
  }
  getLasttab() {
    return this.lasttab;
  }
  getPassword() {
    return this.password;
  }
  getEmail() {
    return this.email;
  }
  static associate(models) {
    // define association here
  }
};
Users.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  opentab: DataTypes.STRING,
  lasttab: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Users',
  timestamps: false,
});

export default Users;