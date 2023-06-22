export type Dimensions = {
    length: string
    width: string
    height: string
    unit: string
}

export type Handling = {
    type: string
    instructions: string
}

export type Weight = {
    value: number
    unit: string
}

export type Compliance = {
    customs: string
    regulatory: string
    certificates: string[]
}

export type ItemRequestBody = {
    name: string
    quantity: number
    supplier: string
    description: string
    manufacturer: string
    colour: string
    category: number
    weight: Weight
    dimensions: Dimensions
    handling: Handling
    compliance: Compliance
}