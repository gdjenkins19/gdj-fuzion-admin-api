/**
 * Service classes are where all the magic happens. Data access
 * comes together with business logic to create a thing of beauty.
 * Other classes, functions, patterns, etc. may be called from here
 * as well to keep things clean and simple.
 */
const ShowRepository = require("../repository/show_repository");

class ShowService {
	constructor(uow) {
		this.userRepo = new ShowRepository(uow);
	}

	getAll(callback) {
		this.userRepo.getAll((err, result) => {
			if (err) return callback(err, null);
			return callback(null, result);
		});
	}
}

module.exports = ShowService;