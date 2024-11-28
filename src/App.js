import React, { useState } from "react";
import jsPDF from "jspdf";
import headerImage from "./Assets/Header.png"; // Import header image
import footerImage from "./Assets/Footer.png"; // Import footer image
import html2canvas from "html2canvas";
import moment from "moment";
import { Checkbox, FormControlLabel, Grid2, TextField } from "@mui/material";

function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    position: "",
    hra: "",
    salary: "",
    employeeName: "",
    employeeBasicPay: "",
    empDesignation: "",
    hrName: "",
    hrDesignation: "",
    jobTitle: "",
    reportingManager: "",
    reportingManagerJobTitle: "",
    joiningDate: "",
    expiryDate: "",
    annualSalary: 0,
    bonus: 0,
    showBonus: false,
    showJoiningBonus: false,
    insurance: 0,
    gb: 0,
    fb: 0,
    pf: 0,
    annualGrossSalary: 0,
    companyLogo: null,
    signature: null,
  });
  const data = {
    components: [
      {
        name: "Basic",
        monthly: formData.employeeBasicPay,
        annual: formData.employeeBasicPay * 12,
      },
      {
        name: "HRA",
        monthly: formData.hra,
        annual: formData.hra * 12,
      },
      {
        name: "Flexible Pay",
        monthly:
          formData.annualSalary -
          formData.hra * 12 -
          formData.employeeBasicPay * 12,
        annual:
          formData.annualSalary -
          formData.hra * 12 -
          formData.employeeBasicPay * 12,
      },
    ],
    totalFixedPay: {
      monthly:
        formData.hra +
        formData.employeeBasicPay +
        (formData.annualSalary -
          formData.hra * 12 -
          formData.employeeBasicPay * 12) /
          12,
      annual: formData.annualSalary,
    },
    benefits: [
      { name: "Employer's PF", monthly: formData.pf / 12, annual: formData.pf },
      {
        name: "Insurance Benefit",
        monthly: formData.insurance / 12,
        annual: formData.insurance,
      },
      {
        name: "Gratuity",
        monthly: (formData.employeeBasicPay * 4.81) / 12,
        annual: formData.employeeBasicPay * 4.81,
      },
    ],
    totalBenefits: {
      monthly:
        formData.pf / 12 +
        formData.insurance / 12 +
        (formData.employeeBasicPay * 4.81) / 12,
      annual:
        formData.pf + formData.insurance + formData.employeeBasicPay * 4.81,
    },
    totalCost: {
      monthly:
        formData.annualSalary / 12 +
        formData.pf / 12 +
        formData.insurance / 12 +
        (formData.employeeBasicPay * 4.81) / 12,
      annual:
        formData.annualSalary +
        formData.pf +
        formData.insurance +
        formData.employeeBasicPay * 4.81,
    },
    "Guaranteed Bonus": {
      monthly:
        formData.pf / 12 +
        formData.insurance / 12 +
        (formData.employeeBasicPay * 4.81) / 12,
      annual:
        formData.pf + formData.insurance + formData.employeeBasicPay * 4.81,
    },
    "Joining Bonus": {
      monthly:
        formData.pf / 12 +
        formData.insurance / 12 +
        (formData.employeeBasicPay * 4.81) / 12,
      annual:
        formData.pf + formData.insurance + formData.employeeBasicPay * 4.81,
    },
  };
  console.log("DATATTTT ", data);
  const handleDownload = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210; // A4 width
    const pageHeight = 297; // A4 height
    const headerHeight = 30;
    const footerHeight = 20;
    const contentHeight = pageHeight - headerHeight - footerHeight;

    const addPageContent = async (elementId, yOffset = headerHeight) => {
      const element = document.getElementById(elementId);

      const canvas = await html2canvas(element, { scale: 1, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight = (canvas.height * pageWidth) / canvas.width;
      pdf.addImage(headerImage, "PNG", 0, 0, pageWidth, headerHeight);

      pdf.addImage(
        imgData,
        "PNG",
        0,
        yOffset,
        pageWidth,
        Math.min(contentHeight, imgHeight)
      );

      pdf.addImage(
        footerImage,
        "PNG",
        0,
        pageHeight - footerHeight,
        pageWidth,
        footerHeight
      );
    };

    await addPageContent("page-1");

    pdf.addPage();
    await addPageContent("page-2");
    pdf.addPage();
    await addPageContent("page-3");
    pdf.addPage();
    await addPageContent("page-4");
     pdf.addPage();
     await addPageContent("page-5");

    pdf.save("pageletter.pdf");
  };
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]:
          type === "file" ? files[0] : type === "checkbox" ? checked : value,
      };

      if (["annualSalary", "insurance", "gb", "fb", "pf"].includes(name)) {
        const annualDeductions =
          parseFloat(updatedData.insurance || 0) +
          parseFloat(updatedData.gb || 0) +
          parseFloat(updatedData.fb || 0) +
          parseFloat(updatedData.pf || 0);
        const basicPay =
          (parseFloat(updatedData.annualSalary || 0) - annualDeductions) * 0.4;
        const hra = basicPay / 2;

        updatedData.employeeBasicPay = basicPay;
        updatedData.hra = hra;
      }

      return updatedData;
    });
  };
  const generateOfferLetter = () => {
    console.log("Form data submitted:", formData);
    console.log("Derived data for table:", data);
    // Add your logic to generate the offer letter here
  };
  return (
    <div style={{ padding: "20px", maxWidth: "800px" }}>
      <h1>PDF Generator</h1>
      <button
        type="button"
        onClick={handleDownload}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Download PDF
      </button>
      <form>
        <Grid2 container spacing={2}>
          {/* First Name */}
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>

          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>

          {/* HR Designation */}
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="HR Designation"
              name="hrDesignation"
              value={formData.hrDesignation}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>

          {/* Job Title */}
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Job Title"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>

          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Reporting Manager"
              name="reportingManager"
              value={formData.reportingManager}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Reporting Manager Deisgnation"
              name="reportingManagerJobTitle"
              value={formData.reportingManagerJobTitle}
              onChange={handleChange}
              variant="outlined"
            />
          </Grid2>

          {/* Date of Joining */}
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Date of Joining"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>

          {/* Expiry Date */}
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>

          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Annual Salary"
              name="annualSalary"
              type="Number"
              value={formData.annualSalary}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Insurance"
              name="insurance"
              type="Number"
              value={formData.insurance}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>

          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="PF"
              name="pf"
              type="Number"
              value={formData.pf}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Guaranteed Bonus"
              name="gb"
              type="Number"
              value={formData.gb}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Fixed Bonus"
              name="fb"
              type="Number"
              value={formData.fb}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Basic Pay Amount"
              name="employeeBasicPay"
              type="Number"
              value={
                (formData.annualSalary -
                  formData.insurance -
                  formData.gb -
                  formData.fb -
                  formData.pf) *
                0.4
              }
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="HRA"
              name="hra"
              type="Number"
              value={
                ((formData.annualSalary -
                  formData.insurance -
                  formData.gb -
                  formData.fb -
                  formData.pf) *
                  0.4) /
                2
              }
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>

          <Grid2 item xs={4}>
            <TextField
              fullWidth
              label="Upload Signature (Optional)"
              name="signature"
              type="file"
              accept="image/*"
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Grid2>
          <Grid2 item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="showBonus"
                  onChange={handleChange}
                  checked={formData.showBonus} // Use `checked` instead of `value` for checkboxes
                />
              }
              label="Show Bonus" // This adds the label
            />
          </Grid2>
          <Grid2 item xs={4}>
            <FormControlLabel
              control={
                <Checkbox
                  name="showJoiningBonus"
                  onChange={handleChange}
                  checked={formData.showJoiningBonus} // Use `checked` instead of `value` for checkboxes
                />
              }
              label="Show Joining Bonus" // This adds the label
            />
          </Grid2>
        </Grid2>
        <button type="button" onClick={generateOfferLetter}>
          Generate Offer Letter
        </button>
      </form>

      {/* Page 1 Content */}
      <div
        id="page-1"
        style={{
          width: "350mm",
          minHeight: "297mm",
          padding: "100px",
          margin: "20px",
          // border: "1px solid #ddd",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          position: "relative",
          lineHeight: "40px",
          textAlign: "justify",
        }}
      >
        <h3 style={{ width: "100%", textAlign: "center" }}>
          Strictly Private and Confidential
        </h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>
            Dear {formData.firstName} {' '}
            {formData.lastName},
          </p>
          <p>{moment(formData.joiningDate).format("MMMM DD, YYYY")}</p>
        </div>
        <p>
          Based on our discussions, I am pleased to offer you employment with
          TPF Software India Private Limited (the “Company”) as set out in the
          terms detailed below:
        </p>
        <h3>Joining Date</h3>
        <p>
          Your scheduled date of employment with us will be{" "}
          {moment(formData.joiningDate).format("MMMM DD, YYYY")} the Company
          however reserves the right, at its absolute discretion, to extend the
          date of joining if it considers it necessary. You shall be notified in
          advance if the date of joining is being extended and the new date of
          joining will be informed accordingly. In case you do not join the
          services of the company by{" "}
          {moment(formData.joiningDate).format("MMMM DD, YYYY")} this offer of
          appointment will stand cancelled and withdrawn without any further
          communication. Your appointment stands effective from the date you
          report in for work, which under no circumstances shall be later than
          date of joining. Any request for change in date unless communicated
          and accepted in writing will not be effective.
        </p>
        <h3> Position</h3>
        <p>
          You will be employed in the full-time position, at 40 hours per week
        </p>
        <p>Job Title : {formData.jobTitle}</p>
        <p>
          {" "}
          Reporting To : {formData.reportingManager} -{" "}
          {formData.reportingManagerJobTitle}
        </p>

        <h3>Location</h3>
        <p>
          Head office located at Featherlite, The address,Block A, 6th floor, Unit no : 601, Featherlite
          The Address, Survey No 203/10B, 200ft, Road, Zamin Pallavaram, MMRD,
          Chennai, Tamil Nadu 600044
        </p>
        <h3>Compensation and Benefit</h3>
        <h3>Salary</h3>
        <p>
          Your Cost to Company shall be Rs.{formData.annualSalary}/- per annum.
          The break-up of your compensation is attached as annexure I. Your
          remuneration shall be divided into 12 (twelve) equal monthly
          instalments and will be paid to you monthly, by way of a direct credit
          transfer to your bank account, as appearing in the records of the
          Company. Your salary and other benefits, if any, shall be subject to
          the deductions of all Government and local taxes, contribution(s),
          etc. as required to be made under the prevailing laws of India and
          shall be further subject. to deductions on account of any unauthorized
          absence for any period beyond the leave entitlement, damage to any
          property of the Company and all other matters as governed by the
          Company&#39;s policy. You will be subjected to Annual Performance
          Review of the respective year. Your career and compensation
          progression will be based on your performance and Company policies
          prevailing at that point of time.
        </p>
      </div>

      {/* Page 2 Content */}
      <div
        id="page-2"
        style={{
          width: "350mm",
          minHeight: "297mm",
          padding: "100px",
          margin: "20px",
          // border: "1px solid #ddd",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          position: "relative",
          lineHeight: "40px",
          textAlign: "justify",
        }}
      >
        {formData.showBonus && (
          <>
            <h3>Guaranteed Bonus and Incentive</h3>
            <p>
              Guaranteed Bonuses are eligible to be paid subject to the employee
              being a full time India employee (and not serving notice period or
              on probation) at the time of payment.
            </p>
          </>
        )}
        {formData.showJoiningBonus && (
          <>
            <h3> Joining bonus</h3>
            <p>
              INR {formData.bonus}The amount will be recoverable from you in
              full, in the unlikely event of separation within 24 months of
              joining.
            </p>
          </>
        )}

        <h3>Flexible benefit plan (FBP)</h3>
        <p>
          The Flexible benefit plan will be paid to you as part of your salary
          every month. You will have the flexibility of choosing the components
          and amounts under such components as per the options provided to you
          on the Company intranet, based on your preferences and income tax
          plans.
        </p>
        <h3>Probation and Confirmation</h3>
        <p>
          You will be on probation for a period of 6 (six) months from the date
          of joining us. On successful completion of your probation, you will be
          confirmed as a permanent employee of the company. During this period,
          either party may terminate this contract by giving forty-five (45)
          days’ notice in writing or salary in lieu thereof, at the sole
          discretion of the Company. Within ten (10) days after completion of 6
          (six) months if you have not received a notification stating otherwise
          including, without limitation, extension of probation period from HR,
          your employment is deemed to be confirmed.
        </p>
        <p>
          After the expiry of the probation period or the extended probation
          period (if the same has been extended) either party is entitled to
          terminate the contract by giving Ninety (90) days’ notice. Whereas the
          Company reserves the right to request service of notice or pay salary
          in lieu of your notice period, waiver or payment in lieu will be at
          the sole discretion of the Company, but in no event will be less than
          the minimum period required by applicable law.
        </p>
        <p>
          For computing the probation period, your actual date of joining the
          Company shall be taken into consideration. Leave You will be governed
          by TSI India leave policy announced from time to time. Further details
          will be provided to you at the time of joining. Notice period.
        </p>
        <ol>
          <li>
            In case of your resignation from the services of the Company, the
            Company at its sole discretion shall have a right, but not an
            obligation, to waive off the notice period and in such cases the
            Company will not be liable to make any payment of salary to the
            employee in lieu of the waived off notice period.
          </li>
          <li>
            During notice period, leave will not be permitted except in case
            of medical emergency. Payment in lieu of unserved notice period will
            be recovered from the employee or notice period may get extended.
          </li>
          <li>
            At the time of termination of your employment contract, you are
            required to return to the Company in acceptable conditions all such
            properties of the Company which are in your possession.
          </li>
          <li>
            You agree that following the notice of termination of your
            employment, you shall cooperate fully with the Company and to the
            satisfaction of the Company in all matters relating to your 3
            employment with the Company and the orderly transition of such work
            to such other employees / persons as the Company may designate.
          </li>
        </ol>
      </div>
      <div
        id="page-3"
        style={{
          width: "350mm",
          minHeight: "297mm",
          padding: "100px",
          margin: "20px",
          // border: "1px solid #ddd",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          position: "relative",
          lineHeight: "40px",
          textAlign: "justify",
        }}
      >
        <h3>Termination without notice</h3>
        <p>
          At the sole discretion of the company your service is liable to be
          terminated without any notice or salary in lieu thereof in the event
          of your involvement in any serious misconduct, nonappearance to work
          without any communication, misdemeanour or any offense which may or
          may not be directly connected with the business of the company. Other
          terms and conditions
        </p>
        <p>
           During your employment, you will be subject to the service rules,
          regulations, and policy of the company applicable from time to time.
        </p>
        <p>
           The Company may, at its discretion conduct background checks prior
          to or after your expected joining date to validate your identity, the
          address provided by you, your education details, and details of your
          prior work experience if any, and to conduct any criminal checks. You
          expressly consent to the Company conducting such background checks.
          This offer will be cancelled and your employment with the company will
          be terminated with immediate effect, if any of the information
          provided by you is found to be false or misleading in the final
          background check report.
        </p>
        <p>We certainly hope that you will be pleased with the foregoing.</p>
        <p>
          If you wish to accept this offer of employment with the Company, you
          must sign and return all the attached documents by no later than 07.00
          p.m. IST, {moment(formData.expiryDate).format("MMMM DD YYYY")}
        </p>
        <p>
          Please feel free to contact Jaishree Vignesh
          (jaishree.vignesh@tpfsoftware.com) if you have any questions or
          concerns.
        </p>
        <p>
          I accept this offer of employment and acknowledge that all the
          information I have provided in relation to my application for
          employment and capacity to undertake the role is true and correct and
          I understand that if I have provided any false or misleading
          information, TPF Software India Private Limited has the right to
          terminate the employment. I acknowledge that I have read and
          understood each term and condition set out in this appointment letter
          &amp; the enclosed Annexure and hereby agree, accept, and undertake to
          abide by all the aforesaid terms and conditions.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 40px",
            // border: "1px solid #ccc",
          }}
        >
          {/* Left Side */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "20px",
              width: "100%",
              // border: "1px solid #ccc",
            }}
          >
            {/* Left Side */}
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: "5px 0" }}>
                <strong>Accepted by</strong>
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>
                  Name:{formData.firstName} {formData.lastName}
                </strong>{" "}
              </p>
              <p style={{ margin: "5px 0" }}>
                <span style={{ textDecoration: "underline" }}>
                  {formData.employeeName}
                </span>
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Date:</strong>
              </p>
              <p style={{ margin: "5px 0" }}>
                <span style={{ textDecoration: "underline" }}>
                  ____________________
                </span>
              </p>
            </div>

            {/* Right Side */}
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  margin: "10px 0",
                  height: "50px",
                  width: "150px",
                  // borderBottom: "1px solid #000",
                  textAlign: "center",
                }}
              >
                {/* Dynamic Signature */}
                {formData.signature ? (
                  <img
                    src={URL.createObjectURL(formData.signature)}
                    alt="Signature"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  <span style={{ color: "#ccc" }}>Signature</span>
                )}
              </div>
              <p style={{ margin: "5px 0" }}>
                <strong>Jaishree Vignesh - Head Human</strong>
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Date:</strong>{" "}
                <span>{moment(new Date()).format("MMMM DD, YYYY")}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        id="page-4"
        style={{
          width: "350mm",
          minHeight: "297mm",
          padding: "100px",
          margin: "20px",
          // border: "1px solid #ddd",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          position: "relative",
          lineHeight: "40px",
          textAlign: "justify",
        }}
      >
        <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
          <h3>Annexure - 1</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr>
                <th style={styles.th}>Components</th>
                <th style={styles.th}>Monthly in INR</th>
                <th style={styles.th}>Annual in INR</th>
              </tr>
            </thead>
            <tbody>
              {/* Basic rows */}
              {data.components.map((item) => (
                <tr key={item.name}>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.monthly}</td>
                  <td style={styles.td}>{item.annual}</td>
                </tr>
              ))}

              {/* Total Fixed Pay row */}
              <tr style={styles.highlightRow}>
                <td style={styles.td}>Total Fixed Pay (A)</td>
                <td style={styles.td}>{data.totalFixedPay.monthly}</td>
                <td style={styles.td}>{data.totalFixedPay.annual}</td>
              </tr>

              {/* Statutory Benefit Header */}
              <tr>
                <td style={styles.subHeader} colSpan={3}>
                  Statutory Benefit
                </td>
              </tr>

              {/* Statutory Benefit rows */}
              {data.benefits.map((item) => (
                <tr key={item.name}>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>{item.monthly}</td>
                  <td style={styles.td}>{item.annual}</td>
                </tr>
              ))}

              {/* Total Benefits row */}
              <tr style={styles.highlightRow}>
                <td style={styles.td}>Total Benefits (B)</td>
                <td style={styles.td}>{data.totalBenefits.monthly}</td>
                <td style={styles.td}>{data.totalBenefits.annual}</td>
              </tr>

              {/* Total Cost to Company row */}
              <tr style={styles.finalRow}>
                <td style={styles.td}>Total Cost to the Company (A + B)</td>
                <td style={styles.td}>{data.totalCost.monthly}</td>
                <td style={styles.td}>{data.totalCost.annual}</td>
              </tr>
            </tbody>
          </table>

          <h6 style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
            *** applicable only for the first year of employment
          </h6>
          <p>
            Note: Salary structure provided in the Annexure -I is subject to
            change based on the insurance premium and FBP declaration.
          </p>
        </div>
      </div>
      <div
        id="page-5"
        style={{
          width: "350mm",
          minHeight: "297mm",
          padding: "100px",
          margin: "20px",
          // border: "1px solid #ddd",
          background: "#fff",
          fontFamily: "Arial, sans-serif",
          fontSize: "25px",
          position: "relative",
          lineHeight: "40px",
          textAlign: "justify",
        }}
      >
        <h3>Compensation Details</h3>
        <p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>
              Basic - Is around 40% of the Annual CTC, it will be paid monthly
              through payroll and is subject to tax as per the prevailing income
              Tax rules.
            </li>
            <li>
              House Rent Allowance (HRA) – 50 % of the Annual Basic, it will be
              paid monthly through payroll. The tax exemption may be claimed on
              submission of rent receipt/ lease agreement as per the prevailing
              income tax rules.
            </li>
            <li>
              Flexible Pay – Balance payments from your allocated fixed CTC.
            </li>
          </ul>
        </p>
        <h3>Retiral Benefits</h3>
        <p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>
              <strong> PF </strong>– Company will contribute a maximum of
              INR1800 against your retiral benefit prescribed by PF act.
            </li>
            <li>
              <strong> House Rent Allowance (HRA)</strong> – 50 % of the Annual
              Basic, it will be paid monthly through payroll. The tax exemption
              may be claimed on submission of rent receipt/ lease agreement as
              per the prevailing income tax rules.
            </li>
          </ul>
        </p>
        <h3>Insurance Benefits</h3>
        <p>
          <p>
            The benefit cost is subject to change year on year based on overall
            group premium cost any increase or decrease in the premium will be
            adjusted against CTC.
          </p>
          <ul style={{ listStyleType: "disc", paddingLeft: "20px" }}>
            <li>
              <strong>Group Term Life Insurance:</strong> This provides life
              coverage for the employee in case of any eventuality, for the sum
              insured of Minimum of INR 20,00,000 and Maximum of sum insured of
              3.5 times of Annual Fixed pay.
            </li>
            <li>
              <strong> Group Personal Accident:</strong> This provides you with
              round the clock financial protection in case of an accident in
              India, Coverage Limit: INR20,00,000 lakhs (Only for employee)
            </li>
          </ul>
        </p>
        <h3>Flexible benefit plan</h3>

        <p>
          Basket of various allowances/ expenses considered for Income Tax
          exemption. Under FBP, you will be granted Telephone and Internet
          Allowance, Books &amp; Periodicals Hostel Allowance, Non-transferable
          food coupons. Employees are given the option to decide which
          components they want to take and how much they want to take under each
          component with some predefined checks and balances.
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // height: '100vh',
            margin: 0,
          }}
        >
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>Flexible Benefit Plan Component</th>
                <th>Maximum Value Per Month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Food Allowance</td>
                <td>2200</td>
              </tr>
              <tr>
                <td>Internet Allowance</td>
                <td>3000</td>
              </tr>
              <tr>
                <td>LTA</td>
                <td>3000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
const styles = {
  th: {
    textAlign: "left",
    padding: "8px",
    border: "1px solid #ddd",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  td: {
    textAlign: "left",
    padding: "8px",
    border: "1px solid #ddd",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
};
