export const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]/;

export const AADHAR_REGEX = /\d{4}\s?\d{4}\s?\d{4}/;

export const CIN_REGEX = /[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}/;

export const LLPIN_REGEX = /[A-Z]{3}-\d{4}/

export const GSTIN_REGEX = /\d{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z\d]Z[A-Z\d]/;

export const URN_REGEX = /UDYAM-(?:I-)?[A-Z]{2}-\d{2}-\d{7}/;

export const BUSINESS_TYPE = [
   'PRIVATE LIMITED',
   'PUBLIC LIMITED',
   'ONE PERSON',
   'LIMITED LIABILITY COMPANY',
   'LIMITED LIABILITY PARTNERSHIP',
   'LLP', 'LLC'
];