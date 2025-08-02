export interface DataItem {
  id: number;
  srNo: string;
  pacsProductCodeAndName: string;
  customerNo: string;
  pacsAccountNo: string;
  pacsName: string;
  limitSanctioned: string;
  drawingPower: string;
  dueDate: string;
  rateOfIntPacs: string;
  accruedIntPacs: string;
  expiryRatePacs: string;
  outstandingAmount: string;
  irregularity: string;
  memberSrNo: string;
  memberProdName: string;
  memberCustomerNo: string;
  memberAccountNo: string;
  memberAccountName: string;
  brNo: string;
  memberLimitSanctioned: string;
  memberDrawingPower: string;
  memberDueDate: string;
  memberUnpaidPrinciple: string;
  memberRateOfInt: string;
  memberAccruedInt: string;
  memberExpiryRate: string;
  memberOutstanding: string;
  memberIrregularity: string;
}

export const dummyData: DataItem[] = [
  {
    id: 1,
    srNo: "1",
    pacsProductCodeAndName: "61301000 KCC - SMALL FARMER",
    customerNo: "403000033186",
    pacsAccountNo: "603006000816",
    pacsName: "V S S KOKDITARAI  REG NO- 588",
    limitSanctioned: "21387000.00",
    drawingPower: "21387000.00",
    dueDate: "31/03/2019",
    rateOfIntPacs: "9.000",
    accruedIntPacs: "228912.32",
    expiryRatePacs: "0.000",
    outstandingAmount: "2299939.41",
    irregularity: "0.00",
    memberSrNo: "1",
    memberProdName: "DMR KCC CASH",
    memberCustomerNo: "403000045035",
    memberAccountNo: "103000327888",
    memberAccountName: "Mr. BED PRAKASH PATEL",
    brNo: "00006",
    memberLimitSanctioned: "48594.00",
    memberDrawingPower: "0.00",
    memberDueDate: "30/09/2018",
    memberUnpaidPrinciple: "48000.00",
    memberRateOfInt: "0.000",
    memberAccruedInt: "252.49",
    memberExpiryRate: "0.000",
    memberOutstanding: "48947.00",
    memberIrregularity: "48947.00"
  },
  {
    id: 2,
    srNo: "1",
    pacsProductCodeAndName: "61301000 KCC - SMALL FARMER",
    customerNo: "403000033186",
    pacsAccountNo: "603006000816",
    pacsName: "V S S KOKDITARAI  REG NO- 588",
    limitSanctioned: "21387000.00",
    drawingPower: "21387000.00",
    dueDate: "31/03/2019",
    rateOfIntPacs: "9.000",
    accruedIntPacs: "228912.32",
    expiryRatePacs: "0.000",
    outstandingAmount: "2299939.41",
    irregularity: "0.00",
    memberSrNo: "2",
    memberProdName: "DMR KCC KIND",
    memberCustomerNo: "403000045035",
    memberAccountNo: "103000327899",
    memberAccountName: "Mr. BED PRAKASH PATEL",
    brNo: "00006",
    memberLimitSanctioned: "0.00",
    memberDrawingPower: "0.00",
    memberDueDate: "99/99/9999",
    memberUnpaidPrinciple: "0.00",
    memberRateOfInt: "0.000",
    memberAccruedInt: "0.00",
    memberExpiryRate: "0.000",
    memberOutstanding: "0.00",
    memberIrregularity: "0.00"
  },
  {
    id: 3,
    srNo: "2",
    pacsProductCodeAndName: "61301001 KCC - MARGINAL FARMER",
    customerNo: "403000034567",
    pacsAccountNo: "603006001234",
    pacsName: "FARMERS COOPERATIVE SOCIETY REG NO- 789",
    limitSanctioned: "15000000.00",
    drawingPower: "15000000.00",
    dueDate: "30/06/2019",
    rateOfIntPacs: "8.500",
    accruedIntPacs: "156789.45",
    expiryRatePacs: "0.000",
    outstandingAmount: "1456789.12",
    irregularity: "0.00",
    memberSrNo: "1",
    memberProdName: "DMR KCC CASH",
    memberCustomerNo: "403000056789",
    memberAccountNo: "103000445566",
    memberAccountName: "Mrs. SUNITA SHARMA",
    brNo: "00007",
    memberLimitSanctioned: "35000.00",
    memberDrawingPower: "5000.00",
    memberDueDate: "15/10/2018",
    memberUnpaidPrinciple: "30000.00",
    memberRateOfInt: "7.500",
    memberAccruedInt: "189.67",
    memberExpiryRate: "0.000",
    memberOutstanding: "30789.67",
    memberIrregularity: "25789.67"
  },
  {
    id: 4,
    srNo: "3",
    pacsProductCodeAndName: "61301002 KCC - LARGE FARMER",
    customerNo: "403000045678",
    pacsAccountNo: "603006002345",
    pacsName: "RURAL DEVELOPMENT SOCIETY REG NO- 456",
    limitSanctioned: "35000000.00",
    drawingPower: "35000000.00",
    dueDate: "31/12/2019",
    rateOfIntPacs: "10.000",
    accruedIntPacs: "345678.90",
    expiryRatePacs: "0.000",
    outstandingAmount: "3456789.23",
    irregularity: "125000.00",
    memberSrNo: "1",
    memberProdName: "DMR KCC KIND",
    memberCustomerNo: "403000067890",
    memberAccountNo: "103000556677",
    memberAccountName: "Mr. RAJESH KUMAR",
    brNo: "00008",
    memberLimitSanctioned: "75000.00",
    memberDrawingPower: "15000.00",
    memberDueDate: "20/11/2018",
    memberUnpaidPrinciple: "65000.00",
    memberRateOfInt: "8.750",
    memberAccruedInt: "456.78",
    memberExpiryRate: "0.000",
    memberOutstanding: "65456.78",
    memberIrregularity: "55456.78"
  },
  {
    id: 5,
    srNo: "4",
    pacsProductCodeAndName: "61301003 KCC - HORTICULTURE",
    customerNo: "403000056789",
    pacsAccountNo: "603006003456",
    pacsName: "HORTICULTURE COOPERATIVE REG NO- 123",
    limitSanctioned: "25000000.00",
    drawingPower: "25000000.00",
    dueDate: "15/09/2019",
    rateOfIntPacs: "9.250",
    accruedIntPacs: "267890.12",
    expiryRatePacs: "0.000",
    outstandingAmount: "2567890.34",
    irregularity: "50000.00",
    memberSrNo: "1",
    memberProdName: "DMR KCC CASH",
    memberCustomerNo: "403000078901",
    memberAccountNo: "103000667788",
    memberAccountName: "Mr. AMIT VERMA",
    brNo: "00009",
    memberLimitSanctioned: "55000.00",
    memberDrawingPower: "10000.00",
    memberDueDate: "05/12/2018",
    memberUnpaidPrinciple: "50000.00",
    memberRateOfInt: "8.000",
    memberAccruedInt: "334.56",
    memberExpiryRate: "0.000",
    memberOutstanding: "50334.56",
    memberIrregularity: "40334.56"
  }
];