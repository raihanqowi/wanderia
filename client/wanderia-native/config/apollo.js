import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://1ce8-139-228-111-125.ap.ngrok.io/',
  cache: new InMemoryCache()
})

export default client;