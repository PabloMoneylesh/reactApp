export const catalogData = {
    items: [
        {
            id: "1",
            name: "Table of Contents",
            description: "Simple table of contents",
            type: "plugin",
            version: 1.0,
            isPaid: true,
            bucket: "pavelb-test.bkt.zooplus.io",
            key: "test/terraform.tfstate"
        },
        {
            id: "2",
            name: "Article thumbnail",
            description: "",
            type: "plugin",
            version: 0.1,
            isPaid: false,
            bucket: "pavelb-test.bkt.zooplus.io",
            key: "test/terraform.tfstate"
        },
        {
            id: "3",
            name: "Microdata injector",
            description: "Microdata injector",
            type: "module",
            version: 1.1,
            isPaid: false,
            bucket: "pavelb-test.bkt.zooplus.io",
            key: "test/terraform.tfstate"
        }
    ],


    getById (id) {
        //return this.items.find(item => item.id === 1);
        var obj;
        for (let item of this.items) {
            if (item.id == id) {
                obj = item;
                break;
            }
        }

       return obj;
    }


};







export default {catalogData};