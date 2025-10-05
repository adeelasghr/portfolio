import { motion } from "framer-motion";
import { X, Gauge, MessageSquare, Car, TrophyIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ContractClosing } from "../../interfaces/Contract";
import loader from "../../assets/images/loader.gif";
import { closeContract, getContractClose } from "../../api/contractApi";
import { baseImageUrl } from "../../utils/config";
import { LookUp } from "../../interfaces/Shared";
import { InspectionBrief } from "../../interfaces/Inpsection";
import {
  getDamageCategory,
  getDamageLocations,
  getVehicleParts,
} from "../../api/inspectionApi";
import MessageBox from "../Shared/MessageBox";
import SigningPad from "../Contracts/SigningPad";

interface ContractDetailsPopupProps {
  contractId: number;
  onClose: () => void;
}

type Inspection = {
  image: File | null;
  remarks: string;
  vehiclePart: number;
  damageCategory: number;
  damageLocation: number;
};

type ExtraCharge = {
  id: number;
  name: string;
  checked: boolean;
  amount: string;
};

const CloseContractPopup: React.FC<ContractDetailsPopupProps> = ({
  contractId,
  onClose,
}) => {
  const [contractDetails, setContractDetails] = useState<ContractClosing>();
  const [loading, setLoading] = useState(true);

  const [inspectionList, setInspectionList] = useState<Inspection[]>([]);
  const [formData, setFormData] = useState({
    endFuelReading: 10,
    endMileage: 0,
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
    remarks: "",
    signature: null as File | null
  });

  //Closing Charges
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([
    { id: 1, name: "Excessive Cleaning", checked: false, amount: "75" },
    { id: 2, name: "Damage Charges", checked: false, amount: "0" },
    { id: 3, name: "Missing Accessory", checked: false, amount: "0" },
    { id: 4, name: "Fuel Adjustment", checked: false, amount: "0" },
    { id: 5, name: "Excess Milage", checked: false, amount: "0" },
    { id: 6, name: "Late Return", checked: false, amount: "" },
  ]);

  const toggleExtraCharge = (id: number) => {
    setExtraCharges((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;

        if (c.name === "Excessive Cleaning") {
          const checked = !c.checked;
          return {
            ...c,
            checked,
            amount: checked ? "75.00" : "",
          };
        }

        return { ...c, checked: !c.checked };
      })
    );
  };

  const changeExtraAmount = (id: number, value: string) => {
    setExtraCharges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, amount: value } : c))
    );

    // Keep formData in sync ONLY for Fuel Adjustment
    const charge = extraCharges.find((c) => c.id === id);
    if (charge?.name === "Fuel Adjustment") {
      var litrePrice = Number(value) * 2.5;
      setFormData((prev) => ({
        ...prev,
        fuelAdjustment: litrePrice.toString(),
      }));
    }
  };

  //Inspection
  const [vehicleParts, setVehicleParts] = useState<LookUp[]>([]);
  const [damageLocations, setDamageLocations] = useState<LookUp[]>([]);
  const [damageCategory, setDamageCategory] = useState<LookUp[]>([]);
  const [inspectionReport, setInspectionReport] = useState<
    InspectionBrief[] | null
  >(null);

  const [selected, setSelected] = useState("in-person");

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetching Contract Data
  useEffect(() => {
    const loadContract = async () => {
      try {
        const data = await getContractClose(contractId);
        setContractDetails(data as ContractClosing);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      } finally {
        setLoading(false);
      }
    };
    loadContract();
  }, [contractId]);

  //Populating FormData
  useEffect(() => {
    if (contractDetails) {
      setFormData((prev) => ({
        ...prev,
        discount: "0",
        totalAmount: contractDetails.totalAmount,
        taxAmount: (Number(contractDetails.totalAmount) * 0.19).toString(),
      }));
    }
  }, [contractDetails]);

  //Fetching Vehicle Parts
  useEffect(() => {
    const fetchVehicleParts = async () => {
      try {
        const response = await getVehicleParts();
        setVehicleParts(response as LookUp[]);
      } catch (error) {
        console.error("Failed to fetch Vehicle Parts", error);
      }
    };
    fetchVehicleParts();
  }, []);

  //Fetching Damage Category
  useEffect(() => {
    const fetchDamageCategory = async () => {
      try {
        const response = await getDamageCategory();
        setDamageCategory(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch Damage Categories", error);
      }
    };
    fetchDamageCategory();
  }, []);

  //Fetching Damage Location
  useEffect(() => {
    const fetchDamageLocation = async () => {
      try {
        const response = await getDamageLocations();
        setDamageLocations(response as LookUp[]);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch Damage Location", error);
      }
    };
    fetchDamageLocation();
  }, []);

  // Check for late return
  useEffect(() => {
    if (!contractDetails?.dropOffDateTime || !contractDetails?.dropOffDateTime)
      return;

    const scheduled = new Date(
      `${contractDetails.dropOffDateTime}T${contractDetails.dropOffDateTime}`
    );

    const tick = () => {
      const now = new Date();
      const msLate = now.getTime() - scheduled.getTime();
      const hoursLate = msLate > 0 ? Math.ceil(msLate / (1000 * 60 * 60)) : 0;

      setExtraCharges((prev) =>
        prev.map((c) => {
          if (c.name !== "Late Return") return c;
          const checked = hoursLate > 0;
          return {
            ...c,
            checked,
            amount: checked ? String(hoursLate * 10) : "",
          };
        })
      );
    };

    tick(); // initial
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [contractDetails]);

  // Check "Excess Milage" when actual KM > allowed KM
  useEffect(() => {
    if (!contractDetails) return;

    const start = Number(contractDetails.startMileage ?? 0);
    const end = Number(formData.endMileage ?? 0);
    const allowed = Number(
      (contractDetails as any)?.kmAllowed ??
        (contractDetails as any)?.KMAllowed ??
        0
    );

    const driven = Math.max(0, end - start);
    const excess = Math.max(0, driven - allowed);

    setExtraCharges((prev) =>
      prev.map((c) => {
        if (c.name !== "Excess Milage") return c;
        const checked = excess > 0;
        return {
          ...c,
          checked,
          // Show additional KMs in the textbox
          amount: checked ? String(excess) : "",
        };
      })
    );
  }, [formData.endMileage, contractDetails]);

  //Applying Discount
  useEffect(() => {
    const netAmount =
      Number(contractDetails?.totalAmount) - Number(formData.discount);
    const taxAmount = netAmount * 0.19; // Tax

    setFormData((prev) => ({
      ...prev,
      totalAmount: netAmount.toString(),
      taxAmount: taxAmount.toString(),
    }));
  }, [formData.discount]);

  //Extra Charges
  useEffect(() => {
    if (!contractDetails) return;

    const baseTotal = Number(contractDetails.totalAmount);
    const discount = Number(formData.discount) || 0;

    const initial = {
      excessiveCleaning: "0",
      damageCharges: "0",
      missingAccessory: "0",
      excessMilage: "0",
      lateReturn: "0",
      fuelAdjustment: "0",
      discount: formData.discount, // keep the ones you want to persist
      endMileage: formData.endMileage,
    };

    const updatedFormData = extraCharges.reduce((acc, c) => {
      switch (c.name) {
        case "Excessive Cleaning":
          acc.excessiveCleaning = c.checked ? c.amount : "0";
          break;
        case "Damage Charges":
          acc.damageCharges = c.checked ? c.amount : "0";
          break;
        case "Missing Accessory":
          acc.missingAccessory = c.checked ? c.amount : "0";
          break;
        case "Excess Milage":
          acc.excessMilage = c.checked
            ? (Number(c.amount) * 0.23).toString()
            : "0";
          break;
        case "Late Return":
          acc.lateReturn = c.checked ? c.amount : "0";
          break;
        case "Fuel Adjustment":
          acc.fuelAdjustment = c.amount;
          break;
      }
      return acc;
    }, initial);

    // Recalculate totalAmount and taxAmount
    const extrasTotal = [
      updatedFormData.excessiveCleaning,
      updatedFormData.damageCharges,
      updatedFormData.missingAccessory,
      updatedFormData.excessMilage,
      updatedFormData.lateReturn,
      updatedFormData.fuelAdjustment,
    ].reduce((sum, val) => sum + (Number(val) || 0), 0);

    const netAmount = baseTotal - discount + extrasTotal;
    const taxAmount = netAmount * 0.19;

    setFormData((prev) => ({
      ...prev,
      ...updatedFormData,
      totalAmount: netAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
    }));
  }, [extraCharges, formData.discount, contractDetails]);

  const handleAddInspection = () => {
    if (
      !inspectionItem.damageCategory ||
      !inspectionItem.damageLocation ||
      !inspectionItem.vehiclePart
    ) {
      alert("Please fill required fields");
      return;
    }

    setInspectionList((prev) => [...prev, inspectionItem]);

    setInspectionItem({
      damageCategory: 0,
      damageLocation: 0,
      vehiclePart: 0,
      remarks: "",
      image: null,
    });
  };

  //Inspection State
  const [inspectionItem, setInspectionItem] = useState<Inspection>({
    damageCategory: 0,
    damageLocation: 0,
    vehiclePart: 0,
    remarks: "",
    image: null as File | null,
  });

  const handleInspectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files && files.length > 0) {
      setInspectionItem((prev) => ({
        ...prev,
        image: files[0], // store the actual File object
      }));
    } else {
      setInspectionItem((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };

  const handleRemoveInspection = (index: number) => {
    setInspectionList((prev) => prev.filter((_, i) => i !== index));
  };

  interface CloseContractResult {
    errors?: string[];
    [key: string]: any;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("ContractID", contractId.toString());
    fd.append("EndMileage", formData.endMileage.toString());
    fd.append("EndFuelReading", formData.endFuelReading.toString());
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
    fd.append("Remarks", formData.remarks.toString());
    fd.append("Signature", formData.signature!);

    // Inspection
    (inspectionList ?? []).forEach((ins: any, i: number) => {
      fd.append(
        `Inspections[${i}].DamageCategory`,
        String(ins.damageCategory ?? 0)
      );
      fd.append(
        `Inspections[${i}].DamageLocation`,
        String(ins.damageLocation ?? 0)
      );
      fd.append(`Inspections[${i}].VehiclePart`, String(ins.vehiclePart ?? 0));
      fd.append(`Inspections[${i}].VehicleID`, String(0));
      fd.append(`Inspections[${i}].Remarks`, ins.remarks ?? "");
      if (ins.image instanceof File) {
        fd.append(`Inspections[${i}].Image`, ins.image);
      }
    });

    const result = (await closeContract(fd)) as CloseContractResult;

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
            className="bg-white w-[70%] rounded-xl overflow-x-hidden overflow-y-auto shadow-2xl popup-bg h-full"
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
                Closing Contract {contractDetails?.contractCode}
              </h3>
              <div className="grid grid-cols-[70%_30%] gap-4">
                <div className="">
                  <div className="grid grid-cols-3 gap-6 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mileage (started: {contractDetails?.startMileage})
                      </label>
                      <div className="relative">
                        <Gauge
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="number"
                          name="endMileage"
                          value={formData.endMileage}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="fuelReading"
                        className="block text-sm font-medium text-gray-700 mb-4"
                      >
                        Fuel Reading
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          id="endFuelReading"
                          type="range"
                          min="1"
                          max="10"
                          step="1"
                          value={formData.endFuelReading}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            setFormData((prev) => ({
                              ...prev,
                              endFuelReading: value,
                            }));
                          }}
                          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 ${
                              (formData.endFuelReading - 1) * 10.9
                            }%, #e5e7eb ${
                              (formData.endFuelReading - 1) * 10.9
                            }%)`,
                          }}
                        />
                      </div>

                      {/* Ticks */}
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        {[...Array(10)].map((_, i) => (
                          <span key={i}>{i + 1}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount
                      </label>
                      <div className="relative">
                        <TrophyIcon
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <input
                          type="number"
                          name="discount"
                          value={formData.discount}
                          onChange={handleInputChange}
                          className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card p-2 rounded-xl border mt-4">
                    <div className="space-y-6">
                      <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {extraCharges.map((c) => {
                            const isFuelAdjustment =
                              c.name === "Fuel Adjustment";
                            const isLateReturn = c.name === "Late Return";
                            const isExCleaning =
                              c.name === "Excessive Cleaning";
                            const isExcessMileage = c.name === "Excess Milage"; // adjust spelling if needed

                            const isActive = isFuelAdjustment
                              ? contractDetails?.fuelCoverage === "Yes"
                                ? c.checked // ignore slider if coverage is Yes
                                : formData.endFuelReading < 10 // otherwise use slider
                              : isLateReturn
                              ? c.checked
                              : c.checked;

                            return (
                              <div key={c.id} className="w-full">
                                <div
                                  className={`flex items-center gap-3 p-3 border rounded-lg ${
                                    isActive
                                      ? "bg-purple-50 border-purple-300"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <input
                                    id={`extra-${c.id}`}
                                    type="checkbox"
                                    checked={isActive}
                                    disabled={
                                      isFuelAdjustment ||
                                      isLateReturn ||
                                      isExcessMileage
                                    }
                                    onChange={() => {
                                      if (
                                        isFuelAdjustment ||
                                        isLateReturn ||
                                        isExcessMileage
                                      )
                                        return;
                                      toggleExtraCharge(c.id);
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />

                                  <label
                                    htmlFor={`extra-${c.id}`}
                                    className="flex-1 text-sm text-gray-800"
                                  >
                                    {c.name}
                                    {/* Notes section */}
                                    {isFuelAdjustment &&
                                      contractDetails?.fuelCoverage ===
                                        "Yes" && (
                                        <p className="text-xs text-gray-500 mt-1">
                                          ✅ Fuel Coverage Available.
                                        </p>
                                      )}
                                    {isExcessMileage && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Allowed: {contractDetails?.kmAllowed}{" "}
                                        {" - "}
                                        Used:{" "}
                                        {formData.endMileage -
                                          Number(contractDetails?.startMileage)}
                                      </p>
                                    )}
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    placeholder={
                                      isFuelAdjustment
                                        ? "litre(s)"
                                        : isExcessMileage
                                        ? "KMs"
                                        : "€ 0.00"
                                    }
                                    readOnly={
                                      isExCleaning ||
                                      isLateReturn ||
                                      isExcessMileage
                                    }
                                    disabled={
                                      !isActive &&
                                      !isExCleaning &&
                                      !isLateReturn
                                    }
                                    value={
                                      isFuelAdjustment
                                        ? formData.fuelAdjustment
                                        : isExCleaning
                                        ? "75.00"
                                        : c.amount
                                    }
                                    onChange={(e) => {
                                      if (isExCleaning || isLateReturn) return;
                                      changeExtraAmount(c.id, e.target.value);
                                    }}
                                    className={`w-28 p-2 border rounded text-sm text-right focus:ring-2 focus:outline-none ${
                                      isActive || isExCleaning || isLateReturn
                                        ? "bg-white border-gray-300 focus:ring-purple-500"
                                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-3xl mx-auto mt-4 mb-2">
                    <div className="flex gap-8 items-center">
                      {/* Left side: radio buttons */}
                      <div className="flex flex-col gap-4 w-1/3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="closingOption"
                            value="in-person"
                            checked={selected === "in-person"}
                            onChange={(e) => setSelected(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium">In-Person Closing</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="closingOption"
                            value="remote"
                            checked={selected === "remote"}
                            onChange={(e) => setSelected(e.target.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-medium">Remote Closing</span>
                        </label>
                      </div>

                      {/* Right side: content */}
                      <div className="flex-1">
                        {selected === "in-person" && (
                          <div className="p-4 pt-2 border rounded-lg bg-blue-50 shadow-sm">
                            <p className="text-gray-600">
                              <SigningPad
                                         onChange={async (png) => {
                                           if (!png) {
                                             setFormData((f) => ({ ...f, signature: null }));
                                             return;
                                           }
                                           // dataURL -> Blob -> File
                                           const blob = await (await fetch(png)).blob();
                                           const file = new File([blob], `signature-${Date.now()}.png`, {
                                             type: "image/png",
                                           });
                                           setFormData((f) => ({ ...f, signature: file }));
                                         }}
                                         height={100}
                                         className="mt-2"
                                       />
                            </p>
                          </div>
                        )}

                        {selected === "remote" && (
                          <div className="p-4 border rounded-lg bg-blue-50 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium"> Remarks</h3>
                            </div>
                            <p className="text-gray-600">
                              <textarea
                              name="remarks"
                                value={formData.remarks}
                               onChange={handleInputChange}
                                placeholder="Add any additional notes here..."
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={2}
                              />
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h5 className=" pb-1">Inspection Report</h5>
                  <div className="card p-4 rounded-xl border">
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-4 mt-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Damage Category
                          </label>
                          <div className="relative">
                            <Car
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <select
                              name="damageCategory"
                              value={inspectionItem.damageCategory}
                              onChange={handleInspectionChange}
                              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select category</option>
                              {damageCategory.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Damage Location
                          </label>
                          <div className="relative">
                            <Car
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <select
                              name="damageLocation"
                              value={inspectionItem.damageLocation}
                              onChange={handleInspectionChange}
                              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select location</option>
                              {damageLocations.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Part
                          </label>
                          <div className="relative">
                            <Car
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <select
                              name="vehiclePart"
                              value={inspectionItem.vehiclePart}
                              onChange={handleInspectionChange}
                              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select group</option>
                              {vehicleParts.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              id="city"
                              name="city"
                              value=""
                              onChange={handleInspectionChange}
                              placeholder="Enter Cost"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        {/* Remarks Input - 3/4 width */}
                        <div className="col-span-3">
                          <div className="relative">
                            <MessageSquare
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={18}
                            />
                            <input
                              name="remarks"
                              type="text"
                              placeholder="Enter remarks"
                              value={inspectionItem.remarks}
                              onChange={handleInspectionChange}
                              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        {/* Button - 1/4 width */}
                        <div className="col-span-1 flex justify-end items-center">
                          <button
                            type="button"
                            onClick={handleAddInspection}
                            className="w-full text-sm bg-purple text-white px-4 py-2 rounded"
                          >
                            Add Image
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      {inspectionList.map((item, idx) => (
                        <div
                          key={idx}
                          className="border text-sm rounded-lg p-4 shadow-sm"
                        >
                          <p>
                            <button
                              type="button"
                              onClick={() => handleRemoveInspection(idx)}
                              className="float-right top-2 right-2 text-red-500 hover:text-red-600"
                            >
                              ✖
                            </button>
                            {damageCategory
                              .find(
                                (cat) => cat.id === Number(item.damageCategory)
                              )
                              ?.name.slice(0, 2) || item.damageCategory}{" "}
                            -{" "}
                            {damageLocations.find(
                              (loc) => loc.id === Number(item.damageLocation)
                            )?.name || item.damageLocation}{" "}
                            -{" "}
                            {vehicleParts.find(
                              (part) => part.id === Number(item.vehiclePart)
                            )?.name || item.vehiclePart}
                          </p>
                          <p>{item.remarks}</p>
                          {item.image && (
                            <img
                              src={
                                item.image instanceof File
                                  ? URL.createObjectURL(item.image)
                                  : item.image
                              }
                              alt="Damage"
                              className="w-full h-32 object-cover mt-2 rounded"
                            />
                          )}
                        </div>
                      ))}

                      {inspectionReport &&
                        inspectionReport.map((item, idx) => (
                          <div
                            key={idx}
                            className="border text-sm rounded-lg p-4 shadow-sm"
                          >
                            <p>{item.remarks}</p>
                            <img
                              src={baseImageUrl + item.image}
                              alt="Damage"
                              className="w-full h-32 object-cover mt-2 rounded"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* <div className="mt-4">
                    <label
                      htmlFor="fuelReading"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Closing Notes
                    </label>
                    <input
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter any additional notes here..."
                    />
                  </div> */}
                  <button
                    type="submit"
                    className="px-6 py-2 mt-6 btn-primary mx-auto text-white rounded-lg"
                    title="Settings"
                  >
                    Close Contract
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border h-full flex flex-col mr-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Excess Milage:
                      <br />
                      <b>€ {Number(formData?.excessMilage).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Fuel Adjustment:
                      <br />
                      <b>€ {Number(formData?.fuelAdjustment).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Excessive Cleaning:
                      <br />
                      <b>€ {Number(formData?.excessiveCleaning).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Missing Accessory:
                      <br />
                      <b>€ {Number(formData?.missingAccessory).toFixed(2)}</b>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      Damage Charges:
                      <br />
                      <b>€ {Number(formData?.damageCharges).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Discount:
                      <br />
                      <b>€ {Number(formData?.discount).toFixed(2)}</b>
                    </span>
                  </div>

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

                  <div className="flex items-center rounded-lg justify-between mb-2 bg-gray-200 p-2">
                    <span>
                      Security Deposit:
                      <br />
                      <b>
                        € {Number(contractDetails?.securityDeposit).toFixed(2)}
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
          title="Contract Closed"
          primaryAction={{ label: "View Contracts", path: "/contracts" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The contract has been closed successfully.
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
