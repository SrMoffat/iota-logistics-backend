import { Channel, Connection } from 'amqplib';

export type Dimensions = {
    unit: string;
    width: string;
    length: string;
    height: string;
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

export type PublishMessageInput = {
    channel: Channel;
    queueName: string;
    message: Object;
};
export type ConsumerMessageInput = {
    channel: Channel;
    queueName: string;
    onMessageReceived: () => void;
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

export type Event = {
    id: number;
    data: Item;
    stage: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    item: Item;
};

export type CreateAndPublishEventInput = {
    item: Item;
    queue: string;
    stage: string;
    status: string;
};

export type ItemDetails = Omit<ItemRequestBody, 'compliance'> & {
    trackingId: string;
    uuid: string;
    dimensions: Dimensions & {
        volume: number | string;
    };
};

export type EventService = {
    publishMessage: (data: PublishMessageInput) => Promise<string>;
    consumeMessages: (data: ConsumerMessageInput) => Promise<string>;
    createEvent: (details: CreateAndPublishEventInput) => Promise<Event>;
    createAndPublishEvent: (details: CreateAndPublishEventInput) => Promise<void>;
    connectToRabbitMq: (url: string) => Promise<{ connection: Connection, channel: Channel }>;
};

export type ItemService = {
    generateTrackingId(): string;
    createItem: (details: ItemDetails) => Promise<Item>;
    blockClearanceFromAccess(details: BlockClearanceInput): string;
    validateRequest(request: ItemRequestBody, schema: Object): Boolean;
    calculateVolume(dimensions: Dimensions): { value: string, representation: string };
};
