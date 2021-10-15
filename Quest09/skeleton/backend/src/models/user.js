import { Model, DataTypes } from "sequelize";
import { sequelize } from "./dbInit";

class Users extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  opentab: DataTypes.STRING,
  lasttab: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Users',
  timestamps: false,
});

export default Users;