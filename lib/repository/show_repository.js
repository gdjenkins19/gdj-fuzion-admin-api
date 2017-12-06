/**
 * A Repository is just that - data access to a particular table
 * or set of tables. It's a way of encapsulating the lowest form
 * of data access for use in service classes, keeping clean
 * separation between data, business logic, and clients.
 */
class ShowRepository {
	constructor(uow) {
		this.uow = uow;
	}

	getAll(callback) {
		this.uow.query("select * from `show`", [], (err, result) => {
			if (err) return callback(err, null);
			return callback(null, result);
		});
	}
}

module.exports = ShowRepository;