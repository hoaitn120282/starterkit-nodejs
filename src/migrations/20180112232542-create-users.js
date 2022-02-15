module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    nonce: {
      allowNull: true,
      type: Sequelize.INTEGER,
    },
    publicAddress: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
      validate: { isLowercase: true },
    },
    walletID: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    token: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface) => queryInterface.dropTable('users'),
};
