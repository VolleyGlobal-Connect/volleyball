
import Razorpay from 'razorpay';

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET!, });
export async function createStakeholder(accountId: string, data: any) {
    return razorpay.stakeholders.create(accountId, {
        name: data.contact_name,
        email: data.email,
        phone: {
            primary: data.phone,
            secondary: "",
        },
        addresses: {
            residential: {
                street: data.profile.addresses.registered.street1,
                city: data.profile.addresses.registered.city,
                state: data.profile.addresses.registered.state,
                postal_code: data.profile.addresses.registered.postal_code,
                country: data.profile.addresses.registered.country,
            },
        },
        kyc: {
            pan: data.legal_info.pan,
        },
        notes: {
            random_key_by_partner: "random_value",
        },
    });
}


export async function requestProductConfig(accountId: string) {
    return razorpay.products.requestProductConfiguration(accountId, {
        "product_name": "route",
        "tnc_accepted": true
    });
}

export async function UpdateProductsConfig(accountId: string, productId: string, body: any) {
    return razorpay.products.edit(accountId, productId, {
        "settlements": {
            "account_number": body.account_number,
            "ifsc_code": body.ifsc_code,
            "beneficiary_name": body.contact_name,
        },
        "tnc_accepted": true
    });
}
export async function payment(amount: number) {
    try {
        let x = razorpay.orders.create({
            amount: amount,
            currency: "INR",
            transfers: [
                {
                    account: "acc_CPRsN1LkFccllA",
                    amount: amount,
                    currency: "INR",
                    notes: {
                        branch: "Acme Corp Bangalore North",
                        name: "Saurav Kumar"
                    },
                    linked_account_notes: [
                        "branch"
                    ],
                    on_hold: true,
                    on_hold_until: 1671222870
                }
            ]
        });
        return x;
    } catch (error) {
        console.log("Error while payment ", error);
    }
}