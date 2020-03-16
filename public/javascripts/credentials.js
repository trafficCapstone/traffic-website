module.exports = {
  main: {
    development: {
      connectionString:
        'mongodb+srv://root:capstone2020@capstone-ltcx2.mongodb.net/main?retryWrites=true&w=majority',
    },
    production: {
      connectionString:
        'mongodb+srv://root:capstone2020@capstone-ltcx2.mongodb.net/main?retryWrites=true&w=majority',
    },
  },
  traffic: {
    development: {
      connectionString:
        'mongodb+srv://root:capstone2020@capstone-ltcx2.mongodb.net/traffic-speed?retryWrites=true&w=majority',
    },
    production: {
      connectionString:
        'mongodb+srv://root:capstone2020@capstone-ltcx2.mongodb.net/traffic-speed?retryWrites=true&w=majority',
    },
  },
};