const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 4000;

// Define the GraphQL schema
const schema = buildSchema(`
  type Query {
    getWeather(city: String!): Weather
  }

  type Weather {
    temperature: Float
    description: String
    city: String
    country: String
  }
`);

// Define the root resolver
const root = {
  getWeather: async ({ city }) => {
    const apiKey = process.env.WEATHER_API_KEY;
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = response.data;

    return {
      temperature: data.main.temp,
      description: data.weather[0].description,
      city: data.name,
      country: data.sys.country,
    };
  },
};

// Setup GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`);
});
