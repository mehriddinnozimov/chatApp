module.exports = {
	development: {
		client: 'pg',
		connection: 'postgres://postgres:postgres@localhost:5432/chatapp',
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds'
		},
	},
	production: {
		client: 'pg',
		connection: process.env.DATABASE_URL,
		migrations: {
			directory: __dirname + '/db/migrations',
		},
		seeds: {
			directory: __dirname + '/db/seeds'
		}
	}
}