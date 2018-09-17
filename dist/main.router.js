"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./common/router");
class MainRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/', (req, res, next) => {
            res.json({
                users: '/users',
            });
        });
    }
}
exports.mainRouter = new MainRouter();
//# sourceMappingURL=main.router.js.map