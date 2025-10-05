import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { EditClosedContract } from "../../interfaces/Contract";
import loader from "../../assets/images/loader.gif";
import { getContractEditClose, updateClosedContract } from "../../api/contractApi";
import MessageBox from "../Shared/MessageBox";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}

const CloseContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [originalData, setOriginalData] = useState<EditClosedContract | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<EditClosedContract>({
    contractID: 0,
    contractCode: "",
    securityDeposit: "0",
    discount: "0",
    totalAmount: "0",
    taxAmount: "0",
    //Extra Charges
    excessiveCleaning: "",
    damageCharges: "0",
    missingAccessory: "0",
    excessMilage: "0",
    lateReturn: "0",
    fuelAdjustment: "0",
    additionalCharges: "0",
  });

  // Define your config array
  const fields: { key: keyof EditClosedContract; label: string }[] = [
    { key: "discount", label: "Discount" },
    { key: "excessiveCleaning", label: "Excessive Cleaning" },
    { key: "damageCharges", label: "Damage Charges" },
    { key: "missingAccessory", label: "Missing Accessory" },
    { key: "excessMilage", label: "Excess Mileage" },
    { key: "lateReturn", label: "Late Return" },
    { key: "fuelAdjustment", label: "Fuel Adjustment" },
    { key: "additionalCharges", label: "Additional Charges" },
  ];

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  // Fetching Contract Data
  useEffect(() => {
    const loadContract = async () => {
      try {
        const data = (await getContractEditClose(
          contractId
        )) as EditClosedContract;

        //Setting OriginaData for Calculation
        setOriginalData(data);

        //Setting form data
        setFormData({
          contractID: data.contractID ?? 0,
          contractCode: data.contractCode,
          securityDeposit: data.securityDeposit?.toString() ?? "0",
          discount: data.discount?.toString() ?? "0",
          totalAmount: data.totalAmount?.toString() ?? "0",
          taxAmount: data.taxAmount?.toString() ?? "0",
          excessiveCleaning: data.excessiveCleaning?.toString() ?? "0",
          damageCharges: data.damageCharges?.toString() ?? "0",
          missingAccessory: data.missingAccessory?.toString() ?? "0",
          excessMilage: data.excessMilage?.toString() ?? "0",
          lateReturn: data.lateReturn?.toString() ?? "0",
          fuelAdjustment: data.fuelAdjustment?.toString() ?? "0",
          additionalCharges: data.additionalCharges?.toString() ?? "0",
        });
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContract();
  }, [contractId]);

  //Amount Updater
  useEffect(() => {
    if (!originalData) return;

    const discount = parseFloat(formData.discount) || 0;

    // Base total is always the original totalAmount from backend
    let totalAmount = parseFloat(originalData.totalAmount) || 0;

    // For each charge, only add the *extra difference* above the original
    const extraExcessMilage =
      (parseFloat(formData.excessMilage) || 0) -
      (parseFloat(originalData.excessMilage) || 0);
    if (extraExcessMilage > 0) totalAmount += extraExcessMilage;

    const extraDamage =
      (parseFloat(formData.damageCharges) || 0) -
      (parseFloat(originalData.damageCharges) || 0);
    if (extraDamage > 0) totalAmount += extraDamage;

    const extraAccessory =
      (parseFloat(formData.missingAccessory) || 0) -
      (parseFloat(originalData.missingAccessory) || 0);
    if (extraAccessory > 0) totalAmount += extraAccessory;

    const extraLateReturn =
      (parseFloat(formData.lateReturn) || 0) -
      (parseFloat(originalData.lateReturn) || 0);
    if (extraLateReturn > 0) totalAmount += extraLateReturn;

    const extraFuelAdjustment =
      (parseFloat(formData.fuelAdjustment) || 0) -
      (parseFloat(originalData.fuelAdjustment) || 0);
    if (extraFuelAdjustment > 0) totalAmount += extraFuelAdjustment;

    const extraCleaning =
      (parseFloat(formData.excessiveCleaning) || 0) -
      (parseFloat(originalData.excessiveCleaning) || 0);
    if (extraCleaning > 0) totalAmount += extraCleaning;

     const additional =
      (parseFloat(formData.additionalCharges) || 0) -
      (parseFloat(originalData.additionalCharges) || 0);
    if (additional > 0) totalAmount += additional;

    // Apply discount
    totalAmount -= discount;

    // Calculate tax
    const taxAmount = totalAmount * 0.19;

    setFormData((prev) => ({
      ...prev,
      totalAmount: totalAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
    }));
  }, [
    formData.discount,
    formData.excessMilage,
    formData.damageCharges,
    formData.missingAccessory,
    formData.lateReturn,
    formData.fuelAdjustment,
    formData.excessiveCleaning,
    formData.additionalCharges,
    originalData,
  ]);

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };

  interface CloseContractResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("ContractID", contractId.toString());
    fd.append("Discount", formData.discount.toString());
    fd.append("TotalAmount", formData.totalAmount.toString());
    fd.append("TaxAmount", formData.taxAmount.toString());
    //Extra Charges
    fd.append("ExcessiveCleaning", formData.excessiveCleaning.toString());
    fd.append("DamageCharges", formData.damageCharges.toString());
    fd.append("MissingAccessory", formData.missingAccessory.toString());
    fd.append("ExcessMilage", formData.excessMilage.toString());
    fd.append("LateReturn", formData.lateReturn.toString());
    fd.append("FuelAdjustment", formData.fuelAdjustment.toString());
    fd.append("AdditionalCharges", formData.additionalCharges.toString());

    const result = (await updateClosedContract(fd)) as CloseContractResult;

    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };
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
    <>
      <form id="bookingForm" onSubmit={handleSubmit}>
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
            className="bg-white w-[50%] rounded-xl overflow-x-hidden overflow-y-auto shadow-2xl popup-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                type="button"
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
            <div className="p-4">
              <h3 className="card-header text-xl mb-6 gap-4">
                Changing Contract {formData?.contractCode}
              </h3>
              <div className="grid grid-cols-[70%_30%] gap-4">
                <div className="">
                  <div className="card p-2 rounded-xl border mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fields.map(({ key, label }) => (
                        <div key={key} className="w-full">
                          <div className="flex items-center gap-3 p-3 border rounded-lg bg-purple-50 border-purple-300">
                            <label className="flex-1 text-sm text-gray-800">
                              {label}
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="€ 0.00"
                              value={formData[key] || "0"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [key]: e.target.value,
                                })
                              }
                              className="w-28 p-2 border rounded text-sm text-right focus:ring-2 focus:outline-none bg-white border-gray-300 focus:ring-purple-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 mt-6 btn-primary mx-auto text-white rounded-lg"
                    title="Settings"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border flex flex-col mr-4">
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-purple-200 p-2">
                    <span>
                      Net Amount:
                      <br />
                      <b>€ {Number(formData?.totalAmount).toFixed(2)}</b>
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-red-200 p-2">
                    <span>
                      Tax (19%):
                      <br />
                      <b>€ {Number(formData?.taxAmount).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center rounded-lg justify-between mb-2 bg-green-200 p-2">
                    <span>
                      Gross Amount:
                      <br />
                      <b>
                        €{" "}
                        {(
                          Number(formData?.totalAmount) +
                          Number(formData?.taxAmount)
                        ).toFixed(2)}
                      </b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </form>

      {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="Contract Updated"
          primaryAction={{ label: "View Contracts", path: "/contracts" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The contract has been updated successfully.
        </MessageBox>
      )}

      {showErrorModal.length > 0 && (
        <MessageBox
          onClose={handleCloseModal}
          code="red"
          title="Something went wrong!"
          primaryAction={{ label: "Go Back", path: "" }}
          secondaryAction={{ label: "", path: "" }}
        >
          <p className="pb-6">Fix the following errors, and try again.</p>
          <div className="bg-red-100 text-red-800 p-4 text-left rounded-md mb-4">
            <ul className="list-disc list-inside">
              {showErrorModal.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </MessageBox>
      )}
    </>
  );
};
export default CloseContractPopup;
