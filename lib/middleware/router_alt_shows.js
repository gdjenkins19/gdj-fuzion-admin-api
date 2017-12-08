const ShowService = require("../service/show_service");

const express = require("express");
const router = express.Router();

router.get("/all", (req, res, next) => {
	let showSvc = new ShowService(req.uow);
	showSvc.getAll((err, shows) => {
		if (err) res.status(500).send(err);
		if (shows) {
			res.status(200).send({alt: shows});
		}
	});
});

module.exports.path = "/altshows"
module.exports.router = router;