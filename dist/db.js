"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect('mongodb://localhost/test');
console.log('db connect success');
mongoose_1.default.connection.on('disconnected', function () {
    console.log('db connect wrong');
});
exports.default = mongoose_1.default;
//# sourceMappingURL=db.js.map