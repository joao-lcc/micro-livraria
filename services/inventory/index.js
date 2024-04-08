const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const products = require('./products.json');
const fs = require('fs');
const packageDefinition = protoLoader.loadSync('proto/inventory.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const inventoryProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

// implementa os métodos do InventoryService
server.addService(inventoryProto.InventoryService.service, {
    searchAllProducts: (_, callback) => {
        callback(null, {
            products: products,
        });
    },
    SearchProductByID: (payload, callback) => {
        callback(
            null,
            products.find((product) => product.id == payload.request.id)
        );
    },
    AddNewBook: (call, callback) => {
        const newProductData = call.request;
        products.push(newProductData);
        const data = JSON.stringify(products);
        fs.writeFile('./services/inventory/products.json', data, (erro)=>{
            if(erro){
                console.log('Erro ao escrever no arquivo:' + erro);
            }
            else{   
                console.log('Arquivo escrito');
            }
        });
        callback(null, newProductData);
      },
});

server.bindAsync('127.0.0.1:3002', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Inventory Service running at http://127.0.0.1:3002');
    server.start();
});
