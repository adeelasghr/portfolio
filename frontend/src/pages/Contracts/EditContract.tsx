import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Search,
  FileText,
  ReceiptIcon,
  MessageSquareIcon,
  MessageSquare,
  Fuel,
  GroupIcon,
  PlusCircle,
  FileWarning,
  User,
} from "lucide-react";

import { Vehicle, VehiclePreview } from "../../interfaces/Vehicle";
import InnerHeader from "../../components/Shared/InnerHeader";
import contract from "../../assets/images/contract.png";
import {
  getContractDetailsForEdit,
  updateContract,
} from "../../api/contractApi";
import { getvehiclePreview } from "../../api/vehicleApi";
import defaultImage from "../../assets/images/reserve.png";
import { getAllAddOns } from "../../api/addOnApi";
import ErrorModal from "../../components/Shared/ErrorModal";
import { LookUp } from "../../interfaces/Shared";
import {
  getDamageCategory,
  getDamageLocations,
  getInspectionBrief,
  getVehicleParts,
} from "../../api/inspectionApi";
import { AddOnsBrief } from "../../interfaces/AddOns";
import MessageBox from "../../components/Shared/MessageBox";
import { parseNum } from "../../utils/parseNum";
import { InspectionBrief } from "../../interfaces/Inpsection";
import { baseImageUrl } from "../../utils/config";
import { useParams } from "react-router-dom";

type AddContractResult = {
  errors?: string[];
  success?: boolean;
};

interface BookingStep {
  title: string;
  description: string;
}
type AddOns = {
  id: number;
  name: string;
  price: number;
};

type Inspection = {
  image: File | null;
  remarks: string;
  vehiclePart: number;
  damageCategory: number;
  damageLocation: number;
};

interface ContractDetails {
  pickupLocID: number;
  dropOffLocID: number;
  pickupDateTime: string;
  dropOffDateTime: string;
  vehicleRate: number;
  vehicleID: number;
  customerID: number;
  vehicleTypeID: number;
}

const steps: BookingStep[] = [
  {
    title: "Contract Details",
    description: "Enter contract information",
  },
  {
    title: "Select Vehicle",
    description: "Choose your preferred car",
  },
  {
    title: "Additional Services",
    description: "Add extra services",
  },
  {
    title: "Pricing & Payments",
    description: "Enter Payment details",
  },
  {
    title: "Inspection Report",
    description: "Inspect the vehicle",
  },
  {
    title: "Contract Summary",
    description: "Confirm contract details",
  },
];

const EditContract: React.FC = () => {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReservation, setIsReservation] = useState(false);
  const [contractCode, setContractCode] = useState("");
  const [vehicles, setVehicles] = useState<VehiclePreview[]>([]);

  //Inspection
  const [vehicleParts, setVehicleParts] = useState<LookUp[]>([]);
  const [damageLocations, setDamageLocations] = useState<LookUp[]>([]);
  const [damageCategory, setDamageCategory] = useState<LookUp[]>([]);
  const [inspectionReport, setInspectionReport] = useState<
    InspectionBrief[] | null
  >(null);

  //Original Values
  const [oTotalAmount, setOTotalAmount] = useState<number>(0);

  //Additional Services
  const [addOns, setAddOns] = useState<AddOns[]>([]);
  const [addOnsList, setAddOnsList] = useState<AddOnsBrief[]>([]);
  const [addOnsTotal, setAddOnsTotal] = useState<number>(0);
  const [selectedAddOns, setSelectedAddOns] =
    useState<({ name: string; price: number; km: number | null } | null)[]>();

  const [showValidationErrorModal, setValidationErrorModal] = useState(false);
  const [validationErrorMessages, setvalidationErrorMessages] = useState<
    string[]
  >([]);

  //Message Boxes
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState<string[]>([]);

  //Inspection State
  const [inspectionItem, setInspectionItem] = useState<Inspection>({
    damageCategory: 0,
    damageLocation: 0,
    vehiclePart: 0,
    remarks: "",
    image: null as File | null,
  });

  const [inspectionList, setInspectionList] = useState<Inspection[]>([]);

  const [date, setDate] = useState("");

  const handleCloseModal = () => {
    //Closing all Message Boxes
    setShowErrorModal([]);
    setShowSuccessModal(false);
  };

  const locations = [
    { id: "1", label: "Tempelhof Office" },
    { id: "3", label: "Berlin Airport" },
  ];

  const filters = [
    { id: "1", label: "Mini" },
    { id: "2", label: "Economy" },
    { id: "3", label: "Compact" },
    { id: "4", label: "StationWagon" },
    { id: "5", label: "SUV" },
    { id: "6", label: "Electric" },
    { id: "7", label: "PeopleCarrier" },
    { id: "8", label: "Transporter" },
  ];

  const [formData, setFormData] = useState({
    // Supporting Values
    contractID: 0,
    contractDate: "",
    contractCode: "",
    clientName: "",
    pickupDate: "",
    dropOffDate: "",
    pickupTime: "",

    // Step 1: Contract Details
    dropOffTime: "",
    pickupLocID: 0,
    dropOffLocID: 0,

    // Step 2: Vehicle Selection
    vehicleTypeID: 0,
    vehicleID: 0,

    // Step 4: Payment & Pricing
    insurance: "",
    deposit: "",
    additionalCharges: "",
    reference: "",
    otherCharges: "",
    remarks: "",
    totalDays: 0,
    dailyRent: "",
    totalAmount: "",
    totalRentals: "",


    // Step 5: Add-ons
    addOns: addOns,

    // Step 6: Inspection
    inspection: [] as Inspection[], // Initialize with empty array
  });

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const data = (await getContractDetailsForEdit(Number(id))) as any;

        const normalizedAddOns = (data.addOns ?? []).map((a: any) => ({
          id: a.id,
          // store KM into `name` because your input reads/writes `name`
          name: (a.kMs ?? "").toString(),
          price: Number(a.price ?? 0),
        }));

        const updatedFormData = {
          ...data,
          addOns: normalizedAddOns,
          reference: data.reference ?? "",
          remarks: data.remarks ?? "",
        } as any;

        setFormData(updatedFormData);
        setAddOnsTotal(data.additionalCharges); // Use data directly

        // Setting original Values
        setOTotalAmount(data.totalAmount);
      } catch (error) {
        console.error("Failed to fetch contract:", error);
      }
    };
    fetchContract();
  }, [id]);

  // Setting today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
    setDate(formattedDate);
  }, []);

  //Fetching Vehicles (By Type)
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = (await getvehiclePreview(
          formData.vehicleTypeID
        )) as Vehicle[];

        const mappedVehicles: VehiclePreview[] = data.map((veh: any) => ({
          id: veh.id.toString(),
          name: veh.name,
          plateNumber: veh.plateNumber,
          type: veh.type,
          category: veh.type?.toLowerCase().replace(/\s/g, ""),
          image: veh.image ? `${baseImageUrl}${veh.image}` : defaultImage,
          price: veh.dailyRate,
          tag: "",
          feul: veh.feul,
          group: veh.group,
          seats: veh.noOfSeats.toString(),
          bags: veh.luggage || 0,
          transmission: veh.transmission || "Automatic",
          hasAC: veh.ac,
          features: veh.features ? veh.features.split(",") : [],
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error("Failed to fetch vehicles", error);
      }
    };

    fetchVehicles();
  }, [formData.vehicleTypeID]);

  //Fetching AddOns
  useEffect(() => {
    const loadAddOns = async () => {
      try {
        const data = await getAllAddOns();
        setAddOnsList(data as AddOnsBrief[]);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch AddOns:", error);
      }
    };

    loadAddOns();
  }, []);

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

  //Fetching Inspection Report based on VehicleID
  useEffect(() => {
    const fetchInspectionReport = async () => {
      if (!formData.vehicleID || formData.vehicleID === 0) return;

      try {
        const data = await await getInspectionBrief(formData.vehicleID);
        setInspectionReport(data as InspectionBrief[]);
        console.log("Inspection Report:", data);
      } catch (error) {
        console.error("Error fetching inspection report:", error);
      }
    };

    fetchInspectionReport();
  }, [formData.vehicleID]);


    const handleInsuranceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Special logic for insurance → auto-fill reference
    if (name === "insurance") {
      let refValue = "";
      if (value === "Full") refValue = "125";
      else if (value === "750") refValue = "875";
      else if (value === "300") refValue = "425";
  
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        securityDeposit: refValue, // update reference based on insurance
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  type AddOnSelection = {
    id: number;
    name?: string; // match AddOns type
  };

  // useEffect(() => {
  //   const other = Number(formData.otherCharges) || 0;
  //   const rentals =
  //     Number(
  //       (formData as any).TotalRentals ?? (formData as any).totalRentals
  //     ) || 0; // pick the right one!
  //   const addons = Number(addOnsTotal) || 0;

  //   const newTotalAmount = other + rentals + addons;

  //   const baseTotal = Number(oTotalAmount) || 0;
  //   const baseDeposit = Number(oDeposit) || 0;

  //   const computedDeposit =
  //     newTotalAmount > baseTotal
  //       ? baseDeposit + (newTotalAmount - baseTotal)
  //       : baseDeposit;

  //   setFormData((prev) => {
  //     const nextDepositStr = computedDeposit.toFixed(2);
  //     if (prev.deposit === nextDepositStr) return prev;
  //     return { ...prev, deposit: nextDepositStr };
  //   });
  // }, [
  //   formData.otherCharges,
  //   (formData as any).TotalRentals,
  //   (formData as any).totalRentals,
  //   addOnsTotal,
  // ]);

  function getSelectedAddOnsDetails(
    selected: AddOnSelection[],
    allAddOns: AddOnsBrief[]
  ) {
    return selected
      .map((sel) => {
        const addOn = allAddOns.find((a) => a.addOnID === sel.id);
        if (!addOn) return null;

        return {
          name: addOn.addOnName,
          price: Number(addOn.price),
          km:
            sel.name !== undefined && sel.name !== null
              ? Number(sel.name)
              : null,
        };
      })
      .filter(Boolean); // remove nulls if an ID didn't match
  }

  function calculateAddOnsTotal(
    selected: AddOnSelection[], // from formData.addOns
    allAddOns: AddOnsBrief[] // from API
  ): number {
    let total = 0;

    for (const sel of selected) {
      const addOn = allAddOns.find((a) => a.addOnID === sel.id);
      if (!addOn) continue; // skip if no match

      // Special handling for KM-based addons
      if (
        addOn.addOnName === "Pickup Service" ||
        addOn.addOnName === "Dropoff Service" ||
        addOn.addOnName === "Extra KMs"
      ) {
        const km = sel.name ?? 0;
        total += Number(addOn.price) * Number(km);
      } else {
        total += Number(addOn.price);
      }
    }

    return total;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();

    // Step 1: Contract Details
    fd.append("ContractID", formData.contractID.toString());
    fd.append("PickUpLocID", formData.pickupLocID.toString());
    fd.append("DropOffLocID", formData.dropOffLocID.toString());
    fd.append("PickUpDate", formData.pickupDate.toString());
    fd.append("DropOffDate", formData.dropOffDate.toString());
    fd.append("PickUpTime", formData.pickupTime.toString());
    fd.append("DropOffTime", formData.dropOffTime.toString());
    fd.append(
      "PickUpDateTime",
      `${formData.pickupDate}T${formData.pickupTime}`
    );
    fd.append(
      "DropOffDateTime",
      `${formData.dropOffDate}T${formData.dropOffTime}`
    );

    // Step 2: Vehicle Selection
    fd.append("VehicleTypeID", formData.vehicleTypeID.toString());
    fd.append("VehicleID", formData.vehicleID.toString());
    // Step 4: Payment & Pricing
    fd.append("Insurance", formData.insurance.toString());
    fd.append("Deposit", formData.deposit.toString());
    fd.append("Reference", formData.reference.toString());
    fd.append("OtherCharges", formData.otherCharges.toString());
    fd.append("Remarks", formData.remarks.toString());
    fd.append("TotalDays", formData.totalDays.toString());
    fd.append("DailyRent", formData.dailyRent.toString());
    fd.append("TotalRentals", formData.totalRentals.toString());
    fd.append("AdditionalCharges", formData.additionalCharges.toString());
    fd.append(
      "TaxAmount",
      (
        (Number(formData.otherCharges) + Number(formData.totalRentals) + addOnsTotal) * 0.19
      ).toFixed(2).toString()
    );
    fd.append(
      "TotalAmount",
      (
        Number(formData.otherCharges) +
        Number(formData.totalRentals) +
        addOnsTotal
      ).toString()
    );

    // Step 5: Add-ons (repeat the same key for each value)
    formData.addOns.forEach((a, i) => {
      fd.append(`AddOns[${i}].Id`, String(a.id));
      fd.append(`AddOns[${i}].Name`, a.name ?? "");
       fd.append(`AddOns[${i}].Price`, String(a.price ?? 0));
    });

    // Step 6: Inspection
    (inspectionList ?? []).forEach((ins: any, i: number) => {
      fd.append(
        `Inspection[${i}].DamageCategory`,
        String(ins.damageCategory ?? 0)
      );
      fd.append(
        `Inspection[${i}].DamageLocation`,
        String(ins.damageLocation ?? 0)
      );
      fd.append(`Inspection[${i}].VehiclePart`, String(ins.vehiclePart ?? 0));
      fd.append(
        `Inspection[${i}].VehicleID`,
        String(ins.vehicleID ?? formData.vehicleID ?? 0)
      );
      fd.append(`Inspection[${i}].Remarks`, ins.remarks ?? "");
      if (ins.image instanceof File) {
        fd.append(`Inspection[${i}].Image`, ins.image); // binds to IFormFile Image
      }
    });

    for (let [key, value] of fd.entries()) {
  console.log(key, value);
}

    const result = updateContract(fd) as AddContractResult;
    if (result?.errors) {
      setShowErrorModal(result.errors);
    } else {
      setShowSuccessModal(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Auto-convert common numeric fields
    const numericFields = [
      "pickUpLocID",
      "dropOffLocID",
      "vehicleID",
      "customerID",
      "vehicleTypeID",
    ];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleAddOnToggle = (addOnID: number) => {
    setFormData((prev) => {
      const existing = prev.addOns.find((item) => item.id === addOnID);
      if (existing) {
        // Remove if already selected
        return {
          ...prev,
          addOns: prev.addOns.filter((item) => item.id !== addOnID),
        };
      } else {
        const addOn = addOnsList.find((item) => item.addOnID === addOnID);
        const isKmAddOn =
          addOn!.addOnName === "Pickup Service" ||
          addOn!.addOnName === "Extra KMs" ||
          addOn!.addOnName === "Dropoff Service";

        return {
          ...prev,
          addOns: [
            ...prev.addOns,
            {
              id: addOn!.addOnID,
              name: isKmAddOn ? "0" : "", // KM add-ons start with 0, others blank
              price: Number(addOn?.price ?? 0),
            },
          ],
        };
      }
    });
  };

  const handleKmChange = (addOnID: number, km: number) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.map((item) =>
        item.id === addOnID ? { ...item, name: km.toString() } : item
      ),
    }));
  };

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

  const handleRemoveInspection = (index: number) => {
    setInspectionList((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextStep = () => {
    const form = document.getElementById("bookingForm") as HTMLFormElement;
    const pickup = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const dropoff = new Date(`${formData.dropOffDate}T${formData.dropOffTime}`);

    // STEP 1: Contract Information Validation
    if (currentStep === 0) {
      // Calculating the number of Days
      const diffTime = dropoff.getTime() - pickup.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({
        ...prev,
        totalDays: diffDays,
      }));

      // Check if pickup is before dropoff
      if (pickup >= dropoff) {
        setvalidationErrorMessages([
          "Return date & time must be after pickup date & time.",
        ]);
        setValidationErrorModal(true);
        return;
      }
    }

    // STEP 2: Vehicle Validation
    if (currentStep === 1) {
      // Calculating the total rental amount
      const daily = parseNum(formData?.dailyRent ?? formData?.dailyRent ?? 0);
      const totalRentals = daily * formData.totalDays;
      setFormData((prev) => ({
        ...prev,
        dailyRent: daily.toString(),
        totalRentals: totalRentals.toString(),
      }));

      if (!formData.vehicleTypeID || !formData.vehicleID) {
        setvalidationErrorMessages([
          "Please select a vehicle before proceeding",
        ]);
        setValidationErrorModal(true);
        return;
      }

      const durationMs = dropoff.getTime() - pickup.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);
      // Check for minimum booking duration
      const vehicleType = formData.vehicleTypeID;
      const minHours = vehicleType === 7 || vehicleType === 8 ? 6 : 24;

      if (durationHours < minHours) {
        setvalidationErrorMessages([
          `Booking must be at least ${minHours} hours for this vehicle. Please change the dates in Step 1`,
        ]);
        setValidationErrorModal(true);
        return;
      }
    }

    if (currentStep === 2) {
      //Calculating AddOn total
      var total = calculateAddOnsTotal(
        formData.addOns as AddOnSelection[],
        addOnsList
      );
      setSelectedAddOns(getSelectedAddOnsDetails(formData.addOns, addOnsList));
      setAddOnsTotal(total);

      setFormData((prev) => ({
        ...prev,
        additionalCharges: total.toString(),
      }));
    }

    if (form && form.checkValidity()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      form?.reportValidity();
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderVehicleSelection = () => (
    <div>
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Type
          </label>
          <select
            required
            name="vehicleTypeID"
            value={formData.vehicleTypeID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a type</option>
            {filters.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4 mt-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vehicle name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        style={{ overflowY: "scroll", height: "450px" }}
      >
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            style={{ height: "fit-content" }}
            className={`
        border rounded-lg p-2 cursor-pointer transition-all duration-300
        ${
          formData.vehicleID === Number(vehicle.id)
            ? "border-purple-600 bg-blue-50"
            : "border-gray-200 hover:border-blue-300"
        }
      `}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                vehicleID: Number(vehicle.id),
                dailyRent: vehicle.price.toFixed(2),
              }))
            }
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-l font-semibold">
                  {vehicle.name} - ({vehicle.plateNumber})
                </h3>
                <p className="text-sm text-gray-500">{vehicle.group}</p>
              </div>
              <Car
                className={
                  formData.vehicleID === Number(vehicle.id)
                    ? "text-purple"
                    : "text-gray-400"
                }
              />
            </div>

            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-32 rounded-lg mb-3"
            />

            <div className="flex space-x-2">
              <p className="text-sm text-left text-gray-600 w-1/2">
                {vehicle.feul}
              </p>
              <p className="text-sm text-right text-gray-600 w-1/2">
                €{vehicle.price}/day
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const rendercontractDetails = () => (
    <div className="space-y-4">
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ marginTop: "25px" }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract No.
          </label>
          <div className="relative">
            <FileText
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              disabled
              type="text"
              name="contractCode"
              value={formData.contractCode}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contract Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              disabled
              type="date"
              name="contractDate"
              value={formData.contractDate}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Client Name
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              disabled
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Location
          </label>
          <select
            disabled
            name="pickUpLocID"
            value={formData.pickupLocID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
          >
            <option value="">Select location</option>
            {locations.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              disabled
              type="date"
              name="pickUpDate"
              value={formData.pickupDate}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pick-up Time
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              disabled
              required
              type="time"
              name="pickUpTime"
              value={formData.pickupTime}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drop-off Location
          </label>
          <select
            required
            name="dropOffLocID"
            value={formData.dropOffLocID}
            onChange={handleInputChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select location</option>
            {locations.map((filter) => (
              <option key={filter.id} value={filter.id}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Date
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              min={formData.pickupDate}
              type="date"
              name="dropOffDate"
              value={formData.dropOffDate}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Time
          </label>
          <div className="relative">
            <Clock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              type="time"
              name="dropOffTime"
              value={formData.dropOffTime}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdditional = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      {addOnsList.map((addOn) => {
        const isSelected = formData.addOns.some(
          (item) => item.id === addOn.addOnID
        );
        return (
          <div
            key={addOn.addOnID}
            onClick={() => handleAddOnToggle(addOn.addOnID)}
            className={`cursor-pointer border rounded-lg p-4 shadow-sm transition-all duration-200 ${
              isSelected
                ? "border-purple-600 bg-purple-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <img
              src={baseImageUrl + addOn.image}
              alt={addOn.addOnName}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h4 className="font-semibold text-l text-gray-800">
              {addOn.addOnName}
            </h4>
            <p className="text-gray-600">€ {addOn.price}</p>

            {(addOn.addOnName === "Pickup Service" ||
              addOn.addOnName === "Extra KMs" ||
              addOn.addOnName === "Dropoff Service") && (
              <input
                type="number"
                placeholder="Enter KM"
                disabled={!isSelected}
                className={`mt-2 w-full p-2 border rounded text-sm focus:ring-2 focus:outline-none ${
                  isSelected
                    ? "border-gray-300 focus:ring-purple-500"
                    : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                onClick={(e) => e.stopPropagation()}
                value={
                  formData.addOns.find((i) => i.id === addOn.addOnID)?.name ??
                  ""
                }
                onChange={(e) =>
                  handleKmChange(addOn.addOnID, Number(e.target.value))
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderInspection = () => (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {inspectionList.map((item, idx) => (
          <div key={idx} className="border text-sm rounded-lg p-4 shadow-sm">
            <p>
              <button
                type="button"
                onClick={() => handleRemoveInspection(idx)}
                className="float-right top-2 right-2 text-red-500 hover:text-red-600"
              >
                ✖
              </button>
              {damageCategory
                .find((cat) => cat.id === Number(item.damageCategory))
                ?.name.slice(0, 2) || item.damageCategory}{" "}
              -{" "}
              {damageLocations.find(
                (loc) => loc.id === Number(item.damageLocation)
              )?.name || item.damageLocation}{" "}
              -{" "}
              {vehicleParts.find((part) => part.id === Number(item.vehiclePart))
                ?.name || item.vehiclePart}
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
            <div key={idx} className="border text-sm rounded-lg p-4 shadow-sm">
              <p>{item.remarks}</p>
              <img
                src={baseImageUrl + item.image}
                alt="Damage"
                className="w-full h-32 object-cover mt-2 rounded"
              />
            </div>
          ))}
      </div>
    </>
  );

  const renderPricing = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mt-6"></div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Type
            </label>
            <div className="relative">
              <ReceiptIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                required
                name="insurance"
                value={formData.insurance}
                onChange={handleInsuranceChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Insurance</option>
               <option value="Full">
                  Full Coverage
                </option>
                <option value="750">
                  750 Liability Coverage
                </option>
                <option value="300">
                  300 Liability Coverage
                </option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reference Number
            </label>
            <div className="relative">
              <ReceiptIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the receipt number"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security Deposit
            </label>
            <div className="relative">
              <ReceiptIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter security deposit"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Other Charges
            </label>
            <div className="relative">
              <ReceiptIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="number"
                name="otherCharges"
                value={formData.otherCharges}
                onChange={handleInputChange}
                className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter other charges"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Remarks
          </label>
          <div className="relative">
            <MessageSquareIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter comments"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const selectedVehicle = vehicles.find(
    (v) => v.id === String(formData.vehicleID)
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div className="">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="text-purple" size={20} />
          <h3 className="text-lg font-semibold text-purple">
            Contract Summary
          </h3>
        </div>
        <div className="gap-4 mt-2"></div>
        <div className="mx-auto overflow-hiddenn">
          <div className="p-2">
            <div className="flex flex-col md:flex-row gap-6 text-sm">
              {/* Left column with details */}
              <div className="flex-1 space-y-2 ">
                <div className="p-4 border rounded-lg bg-gray-50 flex justify-between">
                  {/* Left: Pick Up Details */}
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Pick Up Details:
                    </h3>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-purple" size={16} />
                      <span>
                        {" "}
                        {
                          locations.find(
                            (l) => l.id === String(formData.pickupLocID)
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-purple" size={16} />
                      <span>
                        {formData.pickupDate} at {formData.pickupTime}
                      </span>
                    </div>
                  </div>

                  {/* Right: Drop Off Details */}
                  <div className="flex-1 pl-4 border-l">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Drop Off Details:
                    </h3>
                    <div className="flex items-center space-x-3">
                      <MapPin className="text-purple" size={16} />
                      <span>
                        {" "}
                        {
                          locations.find(
                            (l) => l.id === String(formData.dropOffLocID)
                          )?.label
                        }
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="text-purple" size={16} />
                      <span>
                        {formData.dropOffDate} at {formData.dropOffTime}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedVehicle && (
                  <div className="p-4 border rounded-lg bg-gray-50 flex items-start justify-between">
                    {/* Left: Vehicle info */}
                    <div className="flex-1 pr-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {selectedVehicle.name} ({selectedVehicle.type})
                      </h3>
                      <div className="flex items-center space-x-3">
                        <Fuel className="text-purple" size={16} />
                        <span>{selectedVehicle.feul}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <GroupIcon className="text-purple" size={16} />
                        <span>{selectedVehicle.group}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4 border rounded-lg bg-gray-50 flex justify-between">
                  {/* Left: Pick Up Details */}
                  <div className="flex-1 pr-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Selected Add-Ons
                    </h3>
                    <ul className="list-none list-inside">
                      {(selectedAddOns ?? []).map((item, idx) => (
                        <li key={idx}>
                          {item &&
                            (console.log(item),
                            (
                              <>
                                <div className="flex items-center space-x-3 ml-4">
                                  <PlusCircle
                                    className="text-purple"
                                    size={16}
                                  />
                                  <span>
                                    {item.name} — € {item.price}
                                    {Number(item.km) > 0 && (
                                      <> × {item.km} km</>
                                    )}
                                  </span>
                                </div>
                              </>
                            ))}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1 pl-4 border-l">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Inspection Report
                    </h3>
                    <ul className="list-none list-inside">
                      {/* Newly Added */}
                      {inspectionList.map((item, idx) => (
                        <li key={idx}>
                          {item && (
                            <>
                              <div className="flex items-center space-x-3 ml-4">
                                <FileWarning
                                  className="text-purple"
                                  size={16}
                                />
                                <span>
                                  {
                                    vehicleParts.find(
                                      (vp) => vp.id === Number(item.vehiclePart)
                                    )?.name
                                  }
                                  -
                                  {
                                    damageLocations.find(
                                      (vp) =>
                                        vp.id === Number(item.damageLocation)
                                    )?.name
                                  }
                                  -{item.remarks}
                                </span>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                      {/* Existing Report */}
                      {(inspectionReport ?? []).map((item, idx) => (
                        <li key={idx}>
                          {item && (
                            <>
                              <div className="flex items-center space-x-3 ml-4">
                                <FileWarning
                                  className="text-purple"
                                  size={16}
                                />
                                <span>{item.remarks}</span>
                              </div>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return rendercontractDetails();
      case 1:
        return renderVehicleSelection();
      case 2:
        return renderAdditional();
      case 3:
        return renderPricing();
      case 4:
        return renderInspection();
      case 5:
        return renderSummary();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          <InnerHeader
            title="Change Contract"
            breadcrum="Contracts ➞ Change Contract"
            icon={contract}
          />
        </div>

        <div className="max-w-full">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-2">
            {/* Left Side Navigation */}
            <div
              className="lg:col-span-2 rounded-lg shadow card p-2"
              style={{ minHeight: "70vh" }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`
                  mb-4 p-3 cursor-pointer transition-all
                  ${
                    index === currentStep
                      ? "bg-blue-50 border-l-4 border-purple bg-gray-50"
                      : "hover:bg-gray-50"
                  }
                `}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-center">
                    <div
                      className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-sm
                    ${
                      index <= currentStep
                        ? "bg-purple text-white"
                        : "bg-gray-200 text-gray-600"
                    }
                  `}
                    >
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {step.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div
              className="lg:col-span-6 rounded-lg  card p-2"
              style={{ minHeight: "70vh" }}
            >
              <div
                className="rounded-lg shadow-lg p-6"
                style={{ minHeight: "70vh" }}
              >
                <div className="mb-6">
                  <form id="bookingForm">{renderStepContent()}</form>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6 stick-to-bottom">
                  <button
                    onClick={prevStep}
                    className={`
                    flex items-center px-4 py-2 rounded-lg text-sm
                    ${
                      currentStep === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                    disabled={currentStep === 0}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Previous
                  </button>

                  <button
                    style={{ float: "right", marginRight: "70px" }}
                    onClick={(e) => {
                      e.preventDefault();

                      if (currentStep === steps.length - 1) {
                        const form = document.getElementById(
                          "bookingForm"
                        ) as HTMLFormElement;
                        if (form?.checkValidity()) {
                          console.log(formData);
                          handleSubmit(e);
                        } else {
                          form?.reportValidity();
                        }
                      } else {
                        nextStep();
                      }
                    }}
                    className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    {currentStep === steps.length - 1
                      ? "Change Contract"
                      : "Next"}
                    {currentStep !== steps.length - 1 && (
                      <ArrowRight
                        size={16}
                        className="ml-2"
                        style={{ float: "right", marginTop: "2px" }}
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-lg shadow card p-2">
              {/* Right column */}
              <div className="md:w-full h-full">
                <div className="bg-gray-50 p-4 rounded-lg border h-full flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Rent x days:
                      <br />
                      <b>
                        € {formData.dailyRent ?? 0} x {formData.totalDays ?? 0}
                      </b>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Total Rentals:
                      <br />
                      <b>€ {(formData.totalRentals ?? "0")}</b>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Additional Charges:
                      <br />
                      <b>€ {addOnsTotal.toFixed(2)}</b>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Other Charges:
                      <br />
                      <b>€ {Number(formData.otherCharges || "0").toFixed(2)}</b>
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-purple-200 p-2">
                    <span>
                      Net Amount:
                      <br />
                      <b>
                        €{" "}
                        {(
                          Number(formData.otherCharges) +
                          Number(formData.totalRentals) +
                          addOnsTotal
                        ).toFixed(2)}
                      </b>
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-red-200 p-2">
                    <span className="">
                      Tax (19%):
                      <br />
                      <b>
                        €{" "}
                        {(
                          (Number(formData.otherCharges) +
                            Number(formData.totalRentals) +
                            addOnsTotal) *
                          0.19
                        ).toFixed(2)}
                      </b>
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-green-200 p-2">
                    <span className="">
                      Gross Amount:
                      <br />
                      <b>
                        €{" "}
                        {(
                          Number(formData.otherCharges) +
                          Number(formData.totalRentals) +
                          addOnsTotal +
                          (Number(formData.otherCharges) +
                            Number(formData.totalRentals) +
                            addOnsTotal) *
                            0.19
                        ).toFixed(2)}
                      </b>
                    </span>
                  </div>
                  <div className="flex items-center rounded-lg justify-between mb-2 bg-gray-200 p-2">
                    <span className="">
                      Security Deposit:
                      <br />
                      <b>€ {Number(formData.deposit).toFixed(2)}</b>
                    </span>
                  </div>

                  <div className="flex items-center rounded-lg justify-between mb-2 bg-gray-600 p-2">
                    <span className="text-white">
                      Booked Amount:
                      <br />
                      <b>
                        €{" "}
                        {(
                          Number(formData.otherCharges) +
                          Number(formData.totalRentals) +
                          addOnsTotal +
                          (Number(formData.otherCharges) +
                            Number(formData.totalRentals) +
                            addOnsTotal) *
                            0.19 +
                          Number(formData.deposit)
                        ).toFixed(2)}
                      </b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ErrorModal
        show={showValidationErrorModal}
        errors={validationErrorMessages}
        onClose={() => setValidationErrorModal(false)}
      />

      {showSuccessModal && (
        <MessageBox
          onClose={handleCloseModal}
          code="green"
          title="Contract Created"
          primaryAction={{ label: "View Contracts", path: "/contracts/list" }}
          secondaryAction={{ label: "Go to Dashboard", path: "/dashboard" }}
        >
          The contract has been successfully created. Customer will receive an
          email with the contract details.
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

export default EditContract;