module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'plans',
      [
        {
          title: 'Start',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Gold',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Diamond',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Ruby',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('plans', null, {});
  },
};
