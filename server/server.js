const express = require('express');
const path = require('path');
const db = require('./config/connection');
// Import Apollo Server, Import typeDefs and resolvers
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');

const app = express();
const PORT = process.env.PORT || 3001;
// Creates new Apollo server and passes in schema data
const { authMiddleware } = require('./utils/auth');
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: authMiddleware,
	introspection: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
	// Waits for server to start
	await server.start();
	// Integrates Apollo server with Express application middleware
	server.applyMiddleware({ app });

	// Serves up static assets when app is in production
	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, '../client/build')));
	}

	// Catch-all wild card route for locations not explicitly defined
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/build/index.html'));
	});

	db.once('open', () => {
		app.listen(PORT, () => {
			console.log(`🌍 Now listening on localhost:${PORT}`);
			console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
		})
	});
}

// Async function to start server
startApolloServer(typeDefs, resolvers);