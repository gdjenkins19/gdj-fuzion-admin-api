module.exports = function(router) {
    const ShowService = require("../lib/service/show_service");

    router.get("/shows/all", (req, res, next) => {
        let showSvc = new ShowService(req.uow);
        showSvc.getAll((err, shows) => {
            if (err) res.status(500).send(err);
            if (shows) {
                res.status(200).send(shows);
            }
        });
    });
};   

