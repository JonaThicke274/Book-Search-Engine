import React from 'react';

// ApolloProvider: Allows data providing to other components, 
// ApolloClient: Constructor function that helps init connection to GraphQL api server,
// InMemoryCache: Enables Apollo Client instance to cache API response data so requests are performed efficiently,
// createHttpLink: Allows control of how Apollo Client makes a request (middle ware for outbound network requests)
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Middleware that allos token retrieval of token to combine with httpLink
import { setContext } from '@apollo/client/link/context';

// React router components that allow dynamic display of content on a SPA
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/Navbar';

// Establish link to GraphQL server
const httpLink = createHttpLink({
	uri: '/graphql',
})

// Retrieves token from localstorage and sets HTTP request's head to include token for user-auth requests
// If request doesn't need token, the resolver function won't check for it
const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('id_token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

// Combines authLinnk and httpLink so every request retrieves token and sets headers
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

function App() {
	return (
		// client is passed in as value for client prop in ApolloProvider so everything in the JSX tag has access to server API data
		<ApolloProvider client={client}>
			<Router basename='/'>
			<>
				<Navbar />
					
					<Switch>
						<Route exact path='/' component={SearchBooks} />
						<Route exact path='/saved' component={SavedBooks} />
						<Route render={() => <h1 className='display-2'>Wrong page!</h1>} />
					</Switch>
			</>
			</Router>
		</ApolloProvider>
	);
}

export default App;
