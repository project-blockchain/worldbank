<!-- create new tran -->
["requestTransaction", "12345", "{"name": "rohit", "address":"addr", "bankAccount":{"bankName":"xbank", "accountNo":"1"}}",  "{"name": "akshay", "address":"addr2", "bankAccount":{"bankName":"hdfc", "accountNo":"1"}}", "{"id": "65", "name": "steel material", "quantity": "40", "amount": "4000"}", "this is desc. from requestor"]


<!-- set product supplier approval -->
["setProductSupplierApproval", "rohit", "112345", "true", "{"id": "123", "name": "fedxUser", "address": "fedx address here", "charges": "3000"}", "{"state": "2", "holder": "fedx", "location": "mumbai"}", "IN PROCESS", "this is description from supplier"]

{"id": "123", "name": "fedxUser", "address": "fedx address here", "charges": "3000"}

{"state": "TRANSPROTED", "holder": "fedx", "location": "mumbai"}

<!-- set receiver's bank approval -->
["setReceiversBankApproval", "rohit", "112345", "{"from": "lnt", "to": "xbank", "value": "4000"}", "true", "this is description from receiver bank"]

<!-- product transfet -->
["productTransfer", "rohit", "112345", "fedx", "lnt", "san-fransisko", "3"]

<!-- update product delivery status -->
["updateProductDeliveryStatus", "rohit", "112345","4", "this is desc. from receiver"]

<!-- update order fulfillment status -->
["orderFulfillment", "rohit", "112345", "{"from": "xbank", "to": "tatasteel", "value": "4000"}", "4", "transaction submitted successfully"]

<!-- get transaction -->
["getCbt", "rohit", "112345"]