
export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    phoneNumber: string;
    picture: string;
    email: string;
    streetName: string;
    houseNo: string;
    additionalInfo: string;
    postalCode: string;
    city: string;
    country: string;
    passportNo: string;
    passportIssue: string;
    passportExpiry: string;
    idCardNo: string;
    idCardIssue: string;
    idCardExpiry: string;
    licenseNo: string;
    licenseIssue: string;
    licenseExpiry: string;
    customerCode: string;
    createdAt: string;
    customerDocs: string[];
}

export interface CustomersBrief {
    id: number;
    code: string;
    fullName: string;
    status: string;
    email: string;
    phone: string;
}