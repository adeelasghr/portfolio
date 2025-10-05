import { motion } from "framer-motion";
import { X, Phone, Mail, User, Code, File, Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import loader from "../../assets/images/loader.gif";
import logo from "../../assets/images/logo.png";
import cancel from "../../assets/images/cancelled.jpg";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}
import { getInvoiceDetails } from "../../api/financeApi";
import { InvoiceDetails } from "../../interfaces/Finance";
import { useReactToPrint } from "react-to-print";
import stamp from "../../assets/images/stamp.jpg";
import { baseImageUrl } from "../../utils/config";

const PrintContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>();

  const [loading, setLoading] = useState(true);
  console.log(contractId);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  // Fetching Invoice Data
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await getInvoiceDetails(contractId);
        setInvoiceDetails(data as InvoiceDetails);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, []);

  //Setting Up Loading
  if (loading)
    return (
      <div className="card rounded-lg shadow-md overflow-hidden">
        <p className="flex items-center justify-center h-full">
          <img className="mx-auto w-[20%]" src={loader} />
        </p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 h-full"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0, rotate: -10, y: 100 }}
        animate={{ scale: 1, rotate: 0, y: 0 }}
        exit={{ scale: 0, rotate: 10, y: -100 }}
        transition={{ type: "spring", damping: 15 }}
        className="bg-white rounded-xl shadow-2xl w-[40%] mx-auto h-full overflow-x-hidden overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            ></motion.div>
          </div>
        </div>
        <div>
          <div ref={printRef} className="p-8 text-sm">
            <div className="card-header flex justify-between items-start pb-2">
              {/* Left column: Heading */}
              <div>
                <h2 className="text-xl font-bold">Invoice Details</h2>
                <p className="text-sm">Code: {invoiceDetails?.invoiceCode}</p>
                <p className="text-sm">CSR: {invoiceDetails?.userInfo}</p>
              </div>

              {/* Right column: Company details + logo side-by-side */}
              <div className="flex items-center space-x-4 text-right">
                <div>
                  <h2 className="text-xl font-bold">DeutPak Auto Mieten</h2>
                  <p className="text-sm">+49 30 1234567</p>
                  <p className="text-sm">info@deutpak.com</p>
                </div>
                <img src={logo} alt="Company Logo" className="h-20 w-auto" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-4">
                  <div className="">
                    <div className="gap-4 mt-2"></div>
                    <div className="mx-auto overflow-hiddenn">
                      <div className="p-2">
                        <div className="flex flex-col text-sm">
                          {/* Left column with details */}
                          <div className="space-y-2 ">
                            <div className="p-4 border rounded-lg bg-gray-50 flex justify-between">
                              {/* Left: Pick Up Details */}
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Customer Details:
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <User className="text-purple" size={16} />
                                  <span>{invoiceDetails?.customerName}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Mail className="text-purple" size={16} />
                                  <span>{invoiceDetails?.email}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Phone className="text-purple" size={16} />
                                  <span>{invoiceDetails?.phoneNumber}</span>
                                </div>
                              </div>

                              {/* Right: Drop Off Details */}
                              <div className="flex-1 pl-4 border-l">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Invoice Details:
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <Code className="text-purple" size={16} />
                                  <span>
                                    Code: {invoiceDetails?.invoiceCode}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Calendar className="text-purple" size={16} />
                                  <span>
                                    Date:{" "}
                                    {invoiceDetails?.invoiceDate
                                      ? new Date(
                                          invoiceDetails.invoiceDate
                                        ).toLocaleDateString("en-GB", {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        })
                                      : "-"}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <File className="text-purple" size={16} />
                                  <span>
                                    Contract {invoiceDetails?.contractCode}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="p-2 border rounded-lg bg-gray-50 flex justify-between">
                              {/* Left: Pick Up Details */}
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                  Invoice Items
                                </h3>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                                          #
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-600 border-b">
                                          Item
                                        </th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-600 border-b">
                                          Amount (€)
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(invoiceDetails?.items ?? []).map(
                                        (item, idx) => (
                                          <tr
                                            key={idx}
                                            className="hover:bg-gray-50"
                                          >
                                            <td className="px-4 py-1 border-b text-gray-500">
                                              {idx + 1}
                                            </td>
                                            <td className="px-4 py-1 border-b flex items-center gap-2 text-gray-800">
                                              {item.itemName}
                                            </td>
                                            <td className="px-4 py-1 border-b text-right text-gray-800">
                                              € {Number(item.amount).toFixed(2)}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                  <div className="mt-4 flex justify-end">
                                    <div className="w-1/2 bg-gray-50 p-4 rounded-lg border">
                                      <div className="flex justify-between mb-1">
                                        <span className="text-gray-600 text-sm">
                                          Net Amount:
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                          €{" "}
                                          {invoiceDetails?.netAmount?.toFixed(
                                            2
                                          ) ?? "0.00"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-gray-600 text-sm">
                                          Tax (19%):
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                          €{" "}
                                          {invoiceDetails?.taxAmount?.toFixed(
                                            2
                                          ) ?? "0.00"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between mb-1">
                                        <span className="text-gray-600 text-sm">
                                          Discount:
                                        </span>
                                        <span className="text-gray-900 font-medium">
                                          €{" "}
                                          {invoiceDetails?.discount?.toFixed(
                                            2
                                          ) ?? "0.00"}
                                        </span>
                                      </div>
                                      <div className="flex justify-between border-t border-gray-300 pt-2 mt-2">
                                        <span className="text-gray-800 font-semibold">
                                          Gross Amount:
                                        </span>
                                        <span className="text-gray-900 font-bold">
                                          €{" "}
                                          {invoiceDetails?.grossAmount?.toFixed(
                                            2
                                          ) ?? "0.00"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs mt-2">
                          Thank you for choosing DeutPak Auto Mieten for your
                          car rental needs. <br />
                          We appreciate your business and look forward to
                          serving you again.
                        </div>
                        <div className="mx-auto flex justify-between items-center px-4">
                          {/* Left side */}
                          <div className="text-left">
                            <img
                              src={stamp}
                              alt="Approved Stamp"
                              className="h-20 inline-block"
                            />{" "}
                            <br />
                            <span className="ml-4">Stamp</span>
                          </div>

                          {/* Right side */}
                          <div className="text-right">
                            {invoiceDetails?.signatures ? (
                              <img
                                src={`${baseImageUrl}${invoiceDetails.signatures}`}
                                alt="Customer Signature"
                                className="h-10 inline-block"
                              />
                            ) : invoiceDetails?.netAmount &&
                              invoiceDetails.netAmount > 0 ? (
                              <span className="text-gray-500 text-xs">
                                Contract closed remotly
                              </span>
                            ) : null}

                            {invoiceDetails?.netAmount === 0 && (
                              <img
                                src={cancel}
                                alt="Cancelled"
                                className="h-10 inline-block"
                              />
                            )}
                             <br />
                          
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex justify-center space-x-4"
          >
            <button
              onClick={handlePrint}
              className="px-6 py-2 btn-primary text-white rounded-lg"
            >
              Print
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default PrintContractPopup;
