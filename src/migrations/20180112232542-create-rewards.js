module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('rewards', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    walletID: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    rewardAmount: {
      type: Sequelize.FLOAT,
    },
    rewardType: {
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
  down: (queryInterface) => queryInterface.dropTable('rewards'),
};
