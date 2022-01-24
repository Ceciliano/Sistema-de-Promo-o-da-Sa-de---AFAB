module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'results',
      [
        {
          title: 'Covid',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Depre',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Prisão',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Teste',
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
