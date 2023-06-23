import { Channel, ChannelModel } from 'amqplib';

export type Dimensions = {
    unit: string;
    width: string;
    length: string;
    height: string;
};

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

export type ItemService = {
    generateTrackingId(): string;
    publishMessage: (data: PublishMessageInput) => Promise<string>;
    consumeMessages: (data: ConsumerMessageInput) => Promise<string>;
    blockClearanceFromAccess(details: BlockClearanceInput): string;
    validateRequest(request: ItemRequestBody, schema: Object): Boolean;
    connectToRabbitMq: () => Promise<{ connection: ChannelModel, channel: Channel }>;
    calculateVolume(dimensions: Dimensions): { value: string, representation: string };
};
