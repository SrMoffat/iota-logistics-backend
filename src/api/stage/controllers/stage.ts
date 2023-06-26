/**
 * stage controller
 */
import { get } from 'lodash';
import { factories, Strapi } from '@strapi/strapi'

import { STAGE_API_PATH, STATUS_API_PATH, CATEGORY_API_PATH, CURRENCY_API_PATH } from '../../../../constants';
const currencies = [
    "AED: United Arab Emirates dirham",
    "AFN: Afghan afghani",
    "ALL: Albanian lek",
    "AMD: Armenian dram",
    "ANG: Netherlands Antillean guilder",
    "AOA: Angolan kwanza",
    "ARS: Argentine peso",
    "AUD: Australian dollar",
    "AWG: Aruban florin",
    "AZN: Azerbaijani manat",
    "BAM: Bosnia and Herzegovina convertible mark",
    "BBD: Barbados dollar",
    "BDT: Bangladeshi taka",
    "BGN: Bulgarian lev",
    "BHD: Bahraini dinar",
    "BIF: Burundian franc",
    "BMD: Bermudian dollar",
    "BND: Brunei dollar",
    "BOB: Boliviano",
    "BOV: Bolivian Mvdol",
    "BRL: Brazilian real",
    "BSD: Bahamian dollar",
    "BTN: Bhutanese ngultrum",
    "BWP: Botswana pula",
    "BYR: Belarusian ruble",
    "BZD: Belize dollar",
    "CAD: Canadian dollar",
    "CDF: Congolese franc",
    "CHE: WIR Euro",
    "CHF: Swiss franc",
    "CHW: WIR Franc",
    "CLF: Unidad de Fomento",
    "CLP: Chilean peso",
    "CNY: Chinese yuan",
    "COP: Colombian peso",
    "COU: Unidad de Valor Real",
    "CRC: Costa Rican colon",
    "CUC: Cuban convertible peso",
    "CUP: Cuban peso",
    "CVE: Cape Verdean escudo",
    "CZK: Czech koruna",
    "DJF: Djiboutian franc",
    "DKK: Danish krone",
    "DOP: Dominican peso",
    "DZD: Algerian dinar",
    "EGP: Egyptian pound",
    "ERN: Eritrean nakfa",
    "ETB: Ethiopian birr",
    "EUR: Euro",
    "FJD: Fiji dollar",
    "FKP: Falkland Islands pound",
    "GBP: Pound sterling",
    "GEL: Georgian lari",
    "GHS: Ghanaian cedi",
    "GIP: Gibraltar pound",
    "GMD: Gambian dalasi",
    "GNF: Guinean franc",
    "GTQ: Guatemalan quetzal",
    "GYD: Guyanese dollar",
    "HKD: Hong Kong dollar",
    "HNL: Honduran lempira",
    "HRK: Croatian kuna",
    "HTG: Haitian gourde",
    "HUF: Hungarian forint",
    "IDR: Indonesian rupiah",
    "ILS: Israeli new shekel",
    "INR: Indian rupee",
    "IQD: Iraqi dinar",
    "IRR: Iranian rial",
    "TRY: Turkish lira",
    "TTD: Trinidad and Tobago dollar",
    "TWD: New Taiwan dollar",
    "TZS: Tanzanian shillg",
    "UAH: Ukrainian hryvnia",
    "UGX: Ugandan shilling",
    "USD: United States dollar",
    "USN: United States dollar(next day)",
    "USS: United States dollar(same day)",
    "UYI: Uruguay Peso en Unidedades Indexadas",
    "UYU: Uruguyan peso",
    "UZS: Uzbekistan som",
    "VEF: Venezuelan bolívar soberano",
    "VND: Vietnamese đồng",
    "VUV: Vanuatu vatu",
    "WST: Samoan tala",
    "XAF: CFA franc BEAC",
    "XAG: Silver",
    "XAU: Gold",
    "XCD: East Caribbean dollar",
    "XPD: Palladium",
    "XPF: CFP franc",
    "XPT: Platinum",
    "XTS: Code reserved for testing",
    "XXX: No currency",
    "YER: Yemeni rial",
    "ZAR: South African rand",
    "ZMK: Zambian kwacha",
    "BTC: Bitcoin",
];
const data =
{
    "Warehousing": [
        { name: "Stocked", description: "The item is available in the warehouse inventory.", },
        { name: "Out of Stock", description: "The item is temporarily unavailable in the warehouse inventory.", },
    ],
    "Processing": [
        { name: "Order Received", description: "The system has received an order for the item." },
        { name: "Order Validation", description: "The order is being validated for accuracy and availability." },
        { name: "Order Picking", description: "The item is being picked from the warehouse shelves for fulfillment." },
        { name: "Order Packing", description: "The item is being packed for shipment." },
        { name: "Ready for Dispatch", description: "The item is prepared and ready to be dispatched for delivery." },
    ],
    "Transit": [
        { name: "Shipment Created", description: "The shipment or transport order for the item has been created." },
        { name: "Pick Up", description: "The item is ready for pickup by the carrier or logistics provider" },
        { name: "In Transit", description: "The item is in transit and moving between locations." },
        { name: "Customs Clearance", description: "The item is going through customs procedures at a border or port." },
        { name: "Delayed", description: "The item's transport has experienced a delay, and its delivery is postponed." },
        { name: "En Route", description: "The item is progressing towards its destination." }
    ],
    "Delivery": [
        { name: "Out for Delivery", description: "The item is in transit for final delivery to the recipient." },
        { name: "Delivery Attempted", description: "The carrier has attempted to deliver the item, but the recipient was not available." },
        { name: "Delivery Rescheduled", description: "The delivery of the item has been rescheduled for a later time or date." },
        { name: "Delivered", description: "The item has been successfully delivered to the recipient." },
    ],
    "Returned": [
        { name: "Return Initiated", description: "The recipient has initiated a return request for the item." },
        { name: "Return Shipment", description: "The item is being shipped back to the warehouse or seller for return processing." },
        { name: "Return Received", description: "The returned item has been received at the warehouse" },
        { name: "Return Issued", description: "The refund for the returned item has been processed and issued" },
    ],
    "Recovery": [
        { name: "Lost", description: "The item is lost, and its location cannot be determined." },
        { name: "Damaged", description: " The item has been damaged during transportation or storage." },
    ],
    "Termination": [
        { name: "Archived", description: "The item has completed its life cycle and has been archived for historical purposes." },
        { name: "Completed", description: "The item's journey or process is completed successfully." },
    ],
};

const productCategories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Beauty & Personal Care',
    'Books',
    'Sports & Outdoors',
    'Automotive',
    'Toys & Games',
    'Health & Wellness',
    'Baby & Kids',
    'Grocery',
    'Pet Supplies',
    'Office Supplies',
    'Jewelry',
    'Furniture',
    'Tools & Home Improvement',
    'Movies & Music',
    'Industrial & Scientific',
    'Arts & Crafts',
    'Fashion Accessories'
];

export default factories.createCoreController(`${STAGE_API_PATH}`, ({ strapi }: { strapi: Strapi }) => ({
    async seedStagesAndStatuses(ctx) {
        try {
            const requestBody = get(ctx.request, 'body');
            if (requestBody.data) {
                // TODO: Check permissions, validate request body and if admin, use data to seed DB
            } else {
                // Get stages hard coded data and feed table with stages and status
                Object.keys(data).forEach(async key => {
                    const statuses = data[key]
                    const details = {
                        name: key,
                        description: key,
                    };
                    const newStage = await strapi.entityService.create(`${STAGE_API_PATH}`, {
                        data: details
                    });
                    if (newStage.id) {
                        statuses.forEach(async entry => {
                            const data = {
                                name: entry.name,
                                description: entry.description,
                                stage: newStage.id
                            };
                            await strapi.entityService.create(`${STATUS_API_PATH}`, {
                                data
                            });
                        })
                    }
                });

                productCategories.forEach(async (category) => {
                    const details = {
                        name: category,
                        description: category,
                    };
                    await strapi.entityService.create(`${CATEGORY_API_PATH}`, {
                        data: details
                    });

                })
                currencies.forEach(async (currency) => {
                    const parts = currency.split(":");
                    const details = {
                        code: parts[0],
                        name: parts[1],
                    };
                    await strapi.entityService.create(`${CURRENCY_API_PATH}`, {
                        data: details
                    });

                })
            }
            ctx.body = {
                success: true,
                message: "Seed was successful for Stage, Status, Category and Currency models" 
            };
        } catch (error) {
            console.log('error', error)
            throw new Error(`Error creating event: ${error}`);
        }
    }
}));
