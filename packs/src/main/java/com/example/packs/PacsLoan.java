package com.example.packs;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pacs_loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PacsLoan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String srNo;
    private String pacsProductCodeAndName;
    private String customerNo;
    private String pacsAccountNo;
    private String pacsName;
    private String limitSanctioned;
    private String drawingPower;
    private String dueDate;
    private String rateOfIntPacs;
    private String accruedIntPacs;
    private String expiryRatePacs;
    private String outstandingAmount;
    private String irregularity;

    private String memberSrNo;
    private String memberProdName;
    private String memberCustomerNo;
    private String memberAccountNo;
    private String memberAccountName;
    private String brNo;
    private String memberLimitSanctioned;
    private String memberDrawingPower;
    private String memberDueDate;
    private String memberUnpaidPrinciple;
    private String memberRateOfInt;
    private String memberAccruedInt;
    private String memberExpiryRate;
    private String memberOutstanding;
    private String memberIrregularity;
}

//package com.example.packs;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Entity
//@Table(name = "pacs_loans")
//@Data
//public class PacsLoan {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private Integer pacsSrNo;
//    private String pacsProduct;
//    private String pacsCustomerNo;
//    private String pacsAccountNo;
//    private String pacsName;
//    private Double pacsLimSanctioned;
//    private Double pacsDrawingPower;
//    private String pacsDueDate;
//    private Double pacsRate;
//    private Double pacsAccrued;
//    private Double pacsExpiryRate;
//    private Double pacsOutstanding;
//    private Double pacsIrregularity;
//
//    private Integer memSrNo;
//    private String memProdName;
//    private String memCustomerNo;
//    private String memAccountNo;
//    private String memName;
//    private String memBrNo;
//    private Double memLimSanctioned;
//    private Double memDrawingPower;
//    private String memDueDate;
//    private Double memUnpaidPrinciple;
//    private Double memRate;
//    private Double memAccrued;
//    private Double memExpiryRate;
//    private Double memOutstanding;
//    private Double memIrregularity;
//}
//
