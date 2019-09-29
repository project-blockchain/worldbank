import {Chaincode, StubHelper} from "@theledger/fabric-chaincode-utils";

export default class Firstchaincode extends Chaincode {

    async initLedger(stubHelper: StubHelper, args: string[]) {
        let cars = [];
        cars.push(new Car("1", 'black', "Honda", "Civic"));
        cars.push(new Car("2", 'blue', "Toyota", "Prius"));
        cars.push(new Car("3", 'red', "Suzuki", "Ciaz"));

        for (let i = 0; i < cars.length; i++) {
            const car: Car = cars[i];

            await stubHelper.putState(car.id, car);
            this.logger.info('Added <--> ', car);
        }
    }

    async queryAllCars(stubHelper: StubHelper): Promise<any> {
        return stubHelper.getQueryResultAsList(
            {selector:{ docType: 'car'}}
        );
    }
}

class Car {
    public docType?: string;
    public id: string;
    public color: string;
    public make: string;
    public model: string;

    public constructor(id: string, color: string, make: string, model: string) {
        this.docType = 'car';
        this.id = id;
        this.color = color;
        this.make = make;
        this.model = model;
    }
}