import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        providers: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      user.password_hash = await bcrypt.hash(user.password, 10);
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(pa) {
    return bcrypt.compare(pa, this.password_hash);
  }
}

export default User;
