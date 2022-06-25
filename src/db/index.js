const { PrismaClient } = require('@prisma/client');

async function createDbClient() {
    if (!global?.db) {
        global.db = new PrismaClient();
        console.log('created db client');
    }else{
        console.log('already created db client');
    }
}


module.exports = createDbClient();