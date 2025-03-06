import React from "react";
import img from "@/public/vaibhav.jpg";
import "../../styles/legacy/invoice.css";
import ProductTable from "./ProductTable";
import BillTable from "./BillTable";
import SignTable from "./SignTable";
import Image from "next/image";
import { format } from "date-fns";

const Invoice = React.forwardRef(
  (
    { invoiceData, invoiceDate, productData, bgImage = true }: any,
    ref: any
  ) => {
    return (
      <div ref={ref} className="printable-content" id="get-print">
        <div className="img-container">
          {bgImage && (
            <Image
              className="invoice-img"
              id="invoice-img"
              src={img}
              alt="Image"
            />
          )}

          <div className="content-container">
            <section className="section1">
              <h2 className="invoice_no">
                Invoice No : <span>{invoiceData.invoiceNo}</span>
              </h2>
              <h2 className="invoice_date">
                Invoice Date : <span>{format(invoiceDate, "dd-MM-yyyy")}</span>
              </h2>
            </section>
            <section className="section2">
              <h2 className="tax_head">{invoiceData.invoiceType}</h2>

              <table className="contact-info">
                <tbody>
                  <tr className="personal">
                    <td className="label">
                      <b>Name:</b>
                    </td>
                    <td className="value" style={{ width: "40%" }}>
                      {invoiceData.name}{" "}
                    </td>
                    <td className="value">Phone : {invoiceData.phone} </td>
                  </tr>
                </tbody>
              </table>

              <table className="contact-info" id="add-table">
                <tbody>
                  <tr>
                    <td className="label">
                      <b>Address:</b>
                    </td>
                    <td className="value">{invoiceData.address} </td>
                  </tr>
                </tbody>
              </table>
              <table className="contact-info" id="gst-table">
                <tbody>
                  <tr>
                    <td className="label">
                      <b>GSTIN:</b>
                    </td>
                    <td className="value">{invoiceData.gstin} </td>
                    <td className="value" style={{ width: "43%" }}>
                      <span>
                        PAN No : <span>{invoiceData.pan}</span>
                      </span>{" "}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section className="section3">
              <div>
                <ProductTable sec4={productData} />
              </div>
              {/* <div>
          <div className='total-row'>
          Total : {calculate.tvalTotal}/- &#8377; 
          </div>
        </div> */}

              {/* <section className="section4"> */}
              <div className="section4-flex">
                <div className="notes" style={{ whiteSpace: "pre-line" }}>
                  Notes : {invoiceData.note}
                </div>
                <div>
                  <BillTable
                    discount={invoiceData.discount}
                    netAmount={invoiceData.netAmt}
                    cgst={invoiceData.cgst}
                    sgst={invoiceData.sgst}
                    payment={invoiceData.payment}
                    totalAmount={invoiceData.totalAmt}
                  />
                </div>
              </div>
            </section>

            <section className="section5">
              <SignTable />
            </section>
          </div>
        </div>
      </div>
    );
  }
);

export default Invoice;
