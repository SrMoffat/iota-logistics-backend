export type Dimensions = {
    unit: string;
    width: string;
    length: string;
    height: string;
    units: string;
};

export type Category = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export type Handling = {
    type: string;
    instructions: string;
};

export type Weight = {
    unit: string;
    value: number;
};

export type Compliance = {
    customs: string;
    regulatory: string;
    certificates: string[];
};

export type ItemRequestBody = {
    name: string;
    colour: string;
    weight: Weight;
    quantity: number;
    category: number;
    supplier: string;
    handling: Handling;
    description: string;
    manufacturer: string;
    dimensions: Dimensions;
    compliance: Compliance;
};

export type Role = {
    id: number;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    description: string;
};

export type Auth = {
    id: number;
    role: Role;
    email: string;
    username: string;
    provider: string;
    blocked: boolean;
    password: string;
    createdAt: string;
    updatedAt: string;
    clearance: string;
    confirmed: boolean;
    resetPasswordToken?: string;
    confirmationToken?: string;
};

export type VolumeDetails = {
    value: number;
    representation: string;
};

export type BlockClearanceInput = {
    role: string;
    message: string;
};

export type RabbitMQConnection = {
    createChannel: () => any;
    close: () => any;
};


export type Item = {
    id: number;
    uuid: string;
    trackingId: string;
    name: string;
    quantity: number;
    supplier: string;
    description: string;
    manufacturer: string;
    colour: string;
    createdAt: string;
    updatedAt: string;
    category: Category;
    weight: Weight & { id: number };
    dimensions: Dimensions & {
        id: number;
        volume: number;
    };
    handling: Handling & { id: number; }
}

export type ItemDetails = Omit<ItemRequestBody, 'compliance'> & {
    trackingId: string;
    uuid: string;
    dimensions: Dimensions & {
        volume: number | string;
    };
};

export type UpdateItemInput = {
    trackingId: string;

};

export type ItemService = {
    generateTrackingId(): string;
    createItem: (details: ItemDetails) => Promise<Item>;
    updateItem: (details) => Promise<Item>;
    blockClearanceFromAccess(details: BlockClearanceInput): string;
    validateRequest(request: ItemRequestBody, schema: Object): Boolean;
    calculateVolume(dimensions: Dimensions): { value: string, representation: string };
};
