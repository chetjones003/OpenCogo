
let EntityManager = 0;

export abstract class Entity {
    private id: number;

    constructor() {
        this.id = EntityManager;
        EntityManager++;
    }

    get GetId(): number {
        return this.id;
    }
}
