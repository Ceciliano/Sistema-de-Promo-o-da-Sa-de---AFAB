module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'results',
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
    return queryInterface.bulkDelete('results', null, {});
  },
};
