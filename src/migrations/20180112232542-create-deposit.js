module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('deposits', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    walletID: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    tokenBalance: {
      allowNull: false,
      type: Sequelize.FLOAT,
    },
    tokenType: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    status: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: 'Fail',
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
  down: (queryInterface) => queryInterface.dropTable('deposits'),
};
