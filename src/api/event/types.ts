import { Channel, Connection } from 'amqplib';

import { Item } from '../item/types';

export type StageOrStatus = {
    id: string;
    name: string;
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

export type CreateAndPublishEventInput = {
    item: Item;
    queue: string;
    stage: StageOrStatus;
    status: StageOrStatus;
};

export type Event = {
    id: number;
    data: Item;
    stage: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    item: Item;
};

export type EventService = {
    publishMessage: (data: PublishMessageInput) => Promise<string>;
    consumeMessages: (data: ConsumerMessageInput) => Promise<string>;
    createEvent: (details: CreateAndPublishEventInput) => Promise<Event>;
    createAndPublishEvent: (details: CreateAndPublishEventInput) => Promise<void>;
    connectToRabbitMq: (url: string) => Promise<{ connection: Connection, channel: Channel }>;
};