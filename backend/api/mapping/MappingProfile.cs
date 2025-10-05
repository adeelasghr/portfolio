
using System.Globalization;
using AutoMapper;
using core.entities.client;
using core.entities.contract;
using core.entities.vehicle;
using presentation.viewmodel.contract;
using presentation.viewmodel.customers;
using presentation.viewmodel.shared;
using presentation.viewmodel.vehicles;

namespace api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<string, decimal>()
           .ConvertUsing(s => decimal.Parse(s, NumberStyles.Any, CultureInfo.InvariantCulture));

            CreateMap<AddCustomerVM, Customer>()
             .ForMember(dest => dest.CustomerDocs, opt => opt.Ignore())
            ;
            CreateMap<Customer, CustomerBriefVM>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.CustomerID))
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.CustomerCode))
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.IsActive ? "Active" : "Inactive"));

            CreateMap<AddVehicleVM, Vehicle>()
                .ForMember(dest => dest.VehicleImages, opt => opt.Ignore());

            CreateMap<UpdateVehicleVM, Vehicle>();

            CreateMap<Vehicle, VehiclePreviewVM>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.VehicleID))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => 
                    $"{(src.Brand != null ? src.Brand.Name : string.Empty)} {(src.Model != null ? src.Model.Name : string.Empty)}"))
                .ForMember(dest => dest.dailyRate, opt => opt.MapFrom(src => src.DailyRate))
                .ForMember(dest => dest.PlateNumber, opt => opt.MapFrom(src => src.PlateNumber))
                .ForMember(dest => dest.group, opt => opt.MapFrom(src => src.VehicleGroup != null ? $"{src.VehicleGroup.GroupIntName} / {src.VehicleGroup.GroupExtName}" : string.Empty))
                .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.VehicleType != null ? src.VehicleType.Name : null))
                .ForMember(dest => dest.Features, opt => opt.MapFrom(src => src.Features))
                .ForMember(dest => dest.Transmission, opt => opt.MapFrom(src => src.Transmission != null ? src.Transmission.Name : null))
                .ForMember(dest => dest.NoOfSeats, opt => opt.MapFrom(src => src.NoOfSeats))
                 .ForMember(dest => dest.Feul, opt => opt.MapFrom(src => src.FuelType != null ? src.FuelType.Name : null))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src =>
                        src.VehicleImages != null && src.VehicleImages.Any()
                            ? src.VehicleImages.First().FilePath
                            : null
                    ));

            CreateMap<Vehicle, VehicleBriefVM>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.VehicleID))
                .ForMember(dest => dest.vehicleCode, opt => opt.MapFrom(src => src.VehicleCode))
                .ForMember(dest => dest.makeModel, opt => opt.MapFrom(src => $"{(src.Brand != null ? src.Brand.Name : string.Empty)} {(src.Model != null ? src.Model.Name : string.Empty)}"))
                .ForMember(dest => dest.plateNumber, opt => opt.MapFrom(src => src.PlateNumber))
                .ForMember(dest => dest.dailyRate, opt => opt.MapFrom(src => src.DailyRate))
                .ForMember(dest => dest.group, opt => opt.MapFrom(src => src.VehicleGroup != null ? src.VehicleGroup.GroupIntName : string.Empty))
                .ForMember(dest => dest.vehicleType, opt => opt.MapFrom(src => src.VehicleType != null ? src.VehicleType.Name : null))
                .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.Status));

          

            CreateMap<Contract, ContractOverviewVM>()
                .ForMember(dest => dest.PickupLocID, opt => opt.MapFrom(src => src.PickupLocID))
                .ForMember(dest => dest.DropOffLocID, opt => opt.MapFrom(src => src.DropOffLocID))
                .ForMember(dest => dest.ContractCode, opt => opt.MapFrom(src => src.ContractCode))
                .ForMember(dest => dest.PickupDateTime, opt => opt.MapFrom(src => src.PickupDateTime))
                .ForMember(dest => dest.DropOffDateTime, opt => opt.MapFrom(src => src.DropOffDateTime))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.VehicleCode, opt => opt.MapFrom(src => src.Vehicle != null ? src.Vehicle.VehicleCode : null))
                .ForMember(dest => dest.VehicleName, opt => opt.MapFrom(src =>
                    src.Vehicle != null && src.Vehicle.Brand != null && src.Vehicle.Model != null
                        ? $"{src.Vehicle.Brand.Name} {src.Vehicle.Model.Name}"
                        : string.Empty))
                .ForMember(dest => dest.CustomerCode, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.CustomerCode : null))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName}" : string.Empty));


            CreateMap<Contract, ContractBriefVM>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.ContractID))
                .ForMember(dest => dest.vehicle, opt => opt.MapFrom(src =>
                    src.Vehicle != null && src.Vehicle.Brand != null && src.Vehicle.Model != null
                        ? src.Vehicle.Brand.Name + " " + src.Vehicle.Model.Name
                        : string.Empty))
                .ForMember(dest => dest.client, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FirstName + " " + src.Customer.LastName : string.Empty))
                .ForMember(dest => dest.contractCode, opt => opt.MapFrom(src => src.ContractCode))
                .ForMember(dest => dest.start, opt => opt.MapFrom(src => src.PickupDateTime))
                .ForMember(dest => dest.end, opt => opt.MapFrom(src => src.DropOffDateTime))
                .ForMember(dest => dest.amount, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.status, opt => opt.MapFrom(src => src.Status));

            CreateMap<AddContractVM, Contract>()
                .ForMember(dest => dest.Deposit, opt => opt.MapFrom(src => src.SecurityDeposit))
                .ForMember(dest => dest.AddOns, opt => opt.Ignore());

         

            CreateMap<Contract, ContractCalendarVM>()
           .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.ContractID))
           .ForMember(dest => dest.start, opt => opt.MapFrom(src => src.PickupDateTime))
           .ForMember(dest => dest.end, opt => opt.MapFrom(src => src.DropOffDateTime))
           .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.ContractCode))
           .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName} ({src.Customer.CustomerCode})" : string.Empty))
           .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status));

            CreateMap<Contract, PrintContractVM>()
                .ForMember(dest => dest.VehicleID, opt => opt.MapFrom(src => src.VehicleID))
                .ForMember(dest => dest.ContractCode, opt => opt.MapFrom(src => src.ContractCode))
                .ForMember(dest => dest.VehiclCode, opt => opt.MapFrom(src => src.Vehicle != null ? src.Vehicle.VehicleCode : null))
                .ForMember(dest => dest.VehicleName, opt => opt.MapFrom(src =>
                    src.Vehicle != null && src.Vehicle.Brand != null && src.Vehicle.Model != null
                        ? $"{src.Vehicle.Brand.Name} {src.Vehicle.Model.Name}"
                        : string.Empty))
                .ForMember(dest => dest.FuelReading, opt => opt.MapFrom(src => src.startFuelReading))
                .ForMember(dest => dest.PetrolType, opt => opt.MapFrom(src => src.Vehicle != null && src.Vehicle.FuelType != null ? src.Vehicle.FuelType.Name : null))
                .ForMember(dest => dest.Group, opt => opt.MapFrom(src => src.Vehicle != null && src.Vehicle.VehicleGroup != null ? src.Vehicle.VehicleGroup.GroupIntName : string.Empty))
                .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName}" : string.Empty))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : null))
                .ForMember(dest => dest.PhoneNumber, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.PhoneNumber : null))
                .ForMember(dest => dest.CustomerCode, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.CustomerCode : null))
                .ForMember(dest => dest.PickDateTime, opt => opt.MapFrom(src => src.PickupDateTime))
                .ForMember(dest => dest.PickupLocID, opt => opt.MapFrom(src => src.PickupLocID))
                .ForMember(dest => dest.DropDateTime, opt => opt.MapFrom(src => src.DropOffDateTime))
                .ForMember(dest => dest.DropOffLocID, opt => opt.MapFrom(src => src.DropOffLocID))
                .ForMember(dest => dest.DailyRent, opt => opt.MapFrom(src => src.DailyRent))
                .ForMember(dest => dest.TotalDays, opt => opt.MapFrom(src => src.TotalDays))
                .ForMember(dest => dest.TotalRentals, opt => opt.MapFrom(src => src.TotalRentals))
                .ForMember(dest => dest.AdditionalCharges, opt => opt.MapFrom(src => src.AdditionalCharges))
                .ForMember(dest => dest.OtherCharges, opt => opt.MapFrom(src => src.OtherCharges))
                .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
                .ForMember(dest => dest.SecurityDeposit, opt => opt.MapFrom(src => src.Deposit))
                .ForMember(dest => dest.TaxAmount, opt => opt.MapFrom(src => src.TaxAmount))
                .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Discount))
                .ForMember(dest => dest.Signature, opt => opt.MapFrom(src => src.signatures))
                .ForMember(dest => dest.CreatedOn, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Users != null ? src.Users.Name : string.Empty))
                .ForMember(dest => dest.UserCode, opt => opt.MapFrom(src => src.Users != null ? src.Users.UserCode : null))
                .ForMember(dest => dest.AddOns, opt => opt.MapFrom(src => 
                    (src.AddOns != null 
                        ? src.AddOns.Select(a => new AddOnsVM
                        {
                            AddOnName = a.AddOns != null ? a.AddOns.AddOnName ?? string.Empty : string.Empty,
                            Price = a.AddOnsPrice,
                            AddOnDetail = a.AddOnDetail ?? string.Empty
                        }).ToList()
                        : new List<AddOnsVM>()
                    )));

            CreateMap<ContractAddOns, ContractEditAddOnVM>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.AddOns != null ? src.AddOns.AddOnName : string.Empty))
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.AddOnsPrice))   // from ContractAddOns, not AddOns
                .ForMember(dest => dest.KMs, opt => opt.MapFrom(src => src.AddOnDetail))                                                                            //.ForMember(dest => dest.AddOnDetail, opt => opt.MapFrom(src => src.AddOnDetail))
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.AddOnsID));

            CreateMap<Contract, ContractDetailsVM>()
               .ForMember(dest => dest.PickupLocID, opt => opt.MapFrom(src => src.PickupLocID))
               .ForMember(dest => dest.DropOffLocID, opt => opt.MapFrom(src => src.DropOffLocID))
               .ForMember(dest => dest.PickupDate, opt => opt.MapFrom(src => src.PickupDateTime.ToString("yyyy-MM-dd")))
               .ForMember(dest => dest.DropOffDate, opt => opt.MapFrom(src => src.DropOffDateTime.ToString("yyyy-MM-dd")))
               .ForMember(dest => dest.PickupTime, opt => opt.MapFrom(src => src.PickupDateTime.ToString("HH:mm")))
               .ForMember(dest => dest.DropOffTime, opt => opt.MapFrom(src => src.DropOffDateTime.ToString("HH:mm")))
                .ForMember(dest => dest.ContractDate, opt => opt.MapFrom(src => src.CreatedAt.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.ClientName, opt => opt.MapFrom(src => src.Customer != null ? $"{src.Customer.FirstName} {src.Customer.LastName}" : string.Empty))
                .ForMember(dest => dest.VehicleTypeID, opt => opt.MapFrom(src => src.Vehicle != null ? src.Vehicle.VehicleTypeID : (int?)null))
                .ForMember(dest => dest.AddOns, opt => opt.MapFrom(src => src.AddOns));

            CreateMap<Contract, UpdateContractVM>();

            CreateMap<UpdateContractVM, Contract>()
            .ForMember(dest => dest.ContractID, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.IsActive, opt => opt.Ignore())
            .ForMember(dest => dest.AddOns, opt => opt.Ignore())
            .ForMember(dest => dest.Finances, opt => opt.Ignore())
            .ForMember(dest => dest.History, opt => opt.Ignore())
            .ForMember(dest => dest.startFuelReading, opt => opt.Ignore())
            .ForMember(dest => dest.endFuelReading, opt => opt.Ignore())
            .ForMember(dest => dest.StartMileage, opt => opt.Ignore())
            .ForMember(dest => dest.EndMileage, opt => opt.Ignore())
            .ForMember(dest => dest.BookingID, opt => opt.Ignore());

            CreateMap<Contract, GetCloseContractVM>()
            .ForMember(dest => dest.DropOffDateTime, opt => opt.MapFrom(src => src.DropOffDateTime))
            .ForMember(dest => dest.StartMileage, opt => opt.MapFrom(src => src.StartMileage))
            .ForMember(dest => dest.ContractCode, opt => opt.MapFrom(src => src.ContractCode))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))
            .ForMember(dest => dest.TaxAmount, opt => opt.MapFrom(src => src.TaxAmount))
             .ForMember(dest => dest.SecurityDeposit, opt => opt.MapFrom(src => src.Deposit));

            CreateMap<Contract, CloseContractVM>()
            .ForMember(dest => dest.Discount, opt => opt.MapFrom(src => src.Discount))
            .ForMember(dest => dest.TaxAmount, opt => opt.MapFrom(src => src.TaxAmount))
            .ForMember(dest => dest.TotalAmount, opt => opt.MapFrom(src => src.TotalAmount))

           ;

        }
    }
}