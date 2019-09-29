"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fabric_contract_api_1 = require("fabric-contract-api");
var FabCar = /** @class */ (function (_super) {
    __extends(FabCar, _super);
    function FabCar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FabCar.prototype.initLedger = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var cars, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info('============= START : Initialize Ledger ===========');
                        cars = [
                            {
                                color: 'blue',
                                make: 'Toyota',
                                model: 'Prius',
                                owner: 'Tomoko',
                            },
                            {
                                color: 'red',
                                make: 'Ford',
                                model: 'Mustang',
                                owner: 'Brad',
                            },
                            {
                                color: 'green',
                                make: 'Hyundai',
                                model: 'Tucson',
                                owner: 'Jin Soo',
                            },
                            {
                                color: 'yellow',
                                make: 'Volkswagen',
                                model: 'Passat',
                                owner: 'Max',
                            },
                            {
                                color: 'black',
                                make: 'Tesla',
                                model: 'S',
                                owner: 'Adriana',
                            },
                            {
                                color: 'purple',
                                make: 'Peugeot',
                                model: '205',
                                owner: 'Michel',
                            },
                            {
                                color: 'white',
                                make: 'Chery',
                                model: 'S22L',
                                owner: 'Aarav',
                            },
                            {
                                color: 'violet',
                                make: 'Fiat',
                                model: 'Punto',
                                owner: 'Pari',
                            },
                            {
                                color: 'indigo',
                                make: 'Tata',
                                model: 'Nano',
                                owner: 'Valeria',
                            },
                            {
                                color: 'brown',
                                make: 'Holden',
                                model: 'Barina',
                                owner: 'Shotaro',
                            },
                        ];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < cars.length)) return [3 /*break*/, 4];
                        cars[i].docType = 'car';
                        return [4 /*yield*/, ctx.stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])))];
                    case 2:
                        _a.sent();
                        console.info('Added <--> ', cars[i]);
                        _a.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        console.info('============= END : Initialize Ledger ===========');
                        return [2 /*return*/];
                }
            });
        });
    };
    FabCar.prototype.queryCar = function (ctx, carNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var carAsBytes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ctx.stub.getState(carNumber)];
                    case 1:
                        carAsBytes = _a.sent();
                        if (!carAsBytes || carAsBytes.length === 0) {
                            throw new Error(carNumber + " does not exist");
                        }
                        console.log(carAsBytes.toString());
                        return [2 /*return*/, carAsBytes.toString()];
                }
            });
        });
    };
    FabCar.prototype.createCar = function (ctx, carNumber, make, model, color, owner) {
        return __awaiter(this, void 0, void 0, function () {
            var car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info('============= START : Create Car ===========');
                        car = {
                            color: color,
                            docType: 'car',
                            make: make,
                            model: model,
                            owner: owner,
                        };
                        return [4 /*yield*/, ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)))];
                    case 1:
                        _a.sent();
                        console.info('============= END : Create Car ===========');
                        return [2 /*return*/];
                }
            });
        });
    };
    FabCar.prototype.queryAllCars = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var startKey, endKey, iterator, allResults, res, Key, Record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startKey = 'CAR0';
                        endKey = 'CAR999';
                        return [4 /*yield*/, ctx.stub.getStateByRange(startKey, endKey)];
                    case 1:
                        iterator = _a.sent();
                        allResults = [];
                        _a.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 6];
                        return [4 /*yield*/, iterator.next()];
                    case 3:
                        res = _a.sent();
                        if (res.value && res.value.value.toString()) {
                            console.log(res.value.value.toString('utf8'));
                            Key = res.value.key;
                            Record = void 0;
                            try {
                                Record = JSON.parse(res.value.value.toString('utf8'));
                            }
                            catch (err) {
                                console.log(err);
                                Record = res.value.value.toString('utf8');
                            }
                            allResults.push({ Key: Key, Record: Record });
                        }
                        if (!res.done) return [3 /*break*/, 5];
                        console.log('end of data');
                        return [4 /*yield*/, iterator.close()];
                    case 4:
                        _a.sent();
                        console.info(allResults);
                        return [2 /*return*/, JSON.stringify(allResults)];
                    case 5: return [3 /*break*/, 2];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    FabCar.prototype.changeCarOwner = function (ctx, carNumber, newOwner) {
        return __awaiter(this, void 0, void 0, function () {
            var carAsBytes, car;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.info('============= START : changeCarOwner ===========');
                        return [4 /*yield*/, ctx.stub.getState(carNumber)];
                    case 1:
                        carAsBytes = _a.sent();
                        if (!carAsBytes || carAsBytes.length === 0) {
                            throw new Error(carNumber + " does not exist");
                        }
                        car = JSON.parse(carAsBytes.toString());
                        car.owner = newOwner;
                        return [4 /*yield*/, ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)))];
                    case 2:
                        _a.sent();
                        console.info('============= END : changeCarOwner ===========');
                        return [2 /*return*/];
                }
            });
        });
    };
    return FabCar;
}(fabric_contract_api_1.Contract));
exports.FabCar = FabCar;
