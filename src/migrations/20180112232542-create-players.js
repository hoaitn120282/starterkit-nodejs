module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('players', {
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
    starNumber: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    mana: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    hp: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    skinName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    totalExp: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    external_url: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    image: {
      allowNull: true,
      type: Sequelize.STRING,
    },
    attributes: {
      allowNull: true,
      type: Sequelize.JSONB,
    },
    tokenID: {
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
  down: (queryInterface) => queryInterface.dropTable('players'),
};
