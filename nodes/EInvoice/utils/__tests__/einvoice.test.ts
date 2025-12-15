import { strict as assert } from 'node:assert';

import { parseEInvoiceXML } from '../einvoice';

const singleItemInvoice = `<?xml version="1.0" encoding="UTF-8"?>
<CrossIndustryInvoice>
  <ExchangedDocumentContext>
    <GuidelineSpecifiedDocumentContextParameter>
      <ID>urn:factur-x.eu:1p0:basic</ID>
    </GuidelineSpecifiedDocumentContextParameter>
    <BusinessProcessSpecifiedDocumentContext>
      <ID>A1</ID>
    </BusinessProcessSpecifiedDocumentContext>
  </ExchangedDocumentContext>
  <ExchangedDocument>
    <ID>INV-1</ID>
    <TypeCode>380</TypeCode>
    <IssueDateTime>
      <DateTimeString>20240101</DateTimeString>
    </IssueDateTime>
  </ExchangedDocument>
  <SupplyChainTradeTransaction>
    <ApplicableHeaderTradeAgreement>
      <SellerTradeParty>
        <ID>SELLER-1</ID>
        <Name>Seller Inc</Name>
        <PostalTradeAddress>
          <LineOne>Main Street 1</LineOne>
          <PostcodeCode>12345</PostcodeCode>
          <CityName>City</CityName>
          <CountryID>DE</CountryID>
        </PostalTradeAddress>
        <SpecifiedTaxRegistration>
          <ID schemeID="VAT">DE123</ID>
        </SpecifiedTaxRegistration>
      </SellerTradeParty>
      <BuyerTradeParty>
        <ID>BUYER-1</ID>
        <Name>Buyer GmbH</Name>
        <PostalTradeAddress>
          <LineOne>Buyer Street 5</LineOne>
          <PostcodeCode>54321</PostcodeCode>
          <CityName>Town</CityName>
          <CountryID>DE</CountryID>
        </PostalTradeAddress>
        <SpecifiedTaxRegistration>
          <ID schemeID="VAT">DE321</ID>
        </SpecifiedTaxRegistration>
      </BuyerTradeParty>
    </ApplicableHeaderTradeAgreement>
    <ApplicableHeaderTradeSettlement>
      <InvoiceCurrencyCode>EUR</InvoiceCurrencyCode>
      <PaymentReference>PR1</PaymentReference>
      <ApplicableTradeTax>
        <CalculatedAmount>2.00</CalculatedAmount>
        <BasisAmount>10.00</BasisAmount>
        <RateApplicablePercent>20.0</RateApplicablePercent>
      </ApplicableTradeTax>
      <SpecifiedTradeSettlementHeaderMonetarySummation>
        <GrandTotalAmount>12.00</GrandTotalAmount>
        <LineTotalAmount>10.00</LineTotalAmount>
        <TaxTotalAmount>2.00</TaxTotalAmount>
        <TotalPrepaidAmount>0.00</TotalPrepaidAmount>
        <DuePayableAmount>12.00</DuePayableAmount>
      </SpecifiedTradeSettlementHeaderMonetarySummation>
    </ApplicableHeaderTradeSettlement>
    <IncludedSupplyChainTradeLineItem>
      <AssociatedDocumentLineDocument>
        <LineID>1</LineID>
      </AssociatedDocumentLineDocument>
      <SpecifiedTradeProduct>
        <Name>Product</Name>
      </SpecifiedTradeProduct>
      <SpecifiedLineTradeDelivery>
        <BilledQuantity>1</BilledQuantity>
      </SpecifiedLineTradeDelivery>
      <SpecifiedLineTradeAgreement>
        <NetPriceProductTradePrice>
          <ChargeAmount>10.00</ChargeAmount>
        </NetPriceProductTradePrice>
      </SpecifiedLineTradeAgreement>
      <SpecifiedLineTradeSettlement>
        <SpecifiedTradeSettlementLineMonetarySummation>
          <LineTotalAmount>10.00</LineTotalAmount>
        </SpecifiedTradeSettlementLineMonetarySummation>
      </SpecifiedLineTradeSettlement>
    </IncludedSupplyChainTradeLineItem>
  </SupplyChainTradeTransaction>
</CrossIndustryInvoice>`;

(async () => {
  const invoice = await parseEInvoiceXML(singleItemInvoice, 'simple');

  assert.equal(invoice.transaction.taxes.length, 1);
  assert.equal(invoice.transaction.positions.length, 1);
  assert.equal(invoice.transaction.taxes[0].taxAmount, 2);
  assert.equal(invoice.transaction.positions[0].total, 10);
  assert.equal(invoice.documentId, 'INV-1');

  console.log('Single-tax, single-line-item invoice parsed successfully.');
})();
