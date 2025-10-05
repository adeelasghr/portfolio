using core.entities.contract;
using core.entities.user;
using core.entities.vehicle;
using infastructure.data;

using Microsoft.EntityFrameworkCore;


public static class DbInitializer
{
    public static void Seed(DatabaseContext context)
    {
        context.Database.Migrate();

        SeedUsers(context);
        SeedAddOns(context);
        SeedFuelTypes(context);
        SeedTransmissions(context);
        SeedVehicleGroup(context);
        SeedVehicleBrands(context);
        SeedVehicleModels(context);
        SeedVehicleTypes(context);
        SeedVehicles(context);
    
        context.SaveChanges();
    }

    private static void SeedUsers(DatabaseContext context)
    {
        if (!context.Users.Any(u => u.Email == "admin@deutpak.com"))
        {
            context.Users.Add(new Users
            {
                UserCode = "U001",
                Name = "Admin User",
                Email = "admin@deutpak.com",
                HashKey = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Status = "Active",
                Roles = "Admin"
            });
        }
    }

    private static void SeedAddOns(DatabaseContext context)
    {
        if (!context.AddOns.Any())
        {
            context.AddOns.AddRange(
                new AddOns
                {
                    AddOnID = 14,
                    AddOnCode = "AD-1008",
                    AddOnName = "Pickup Service",
                    Price = 5,
                    Deatils = "Pickup Service",
                    Image = "/uploads/addons/AD-1008.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 15,
                    AddOnCode = "AD-1009",
                    AddOnName = "Dropoff Service",
                    Price = 5,
                    Deatils = "Dropoff Service",
                    Image = "/uploads/addons/AD-1009.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 16,
                    AddOnCode = "AD-1011",
                    AddOnName = "Extra KMs",
                    Price = 5,
                    Deatils = "Extra KMs",
                    Image = "/uploads/addons/AD-1011.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 17,
                    AddOnCode = "AD-1010",
                    AddOnName = "Border Crossing",
                    Price = 50,
                    Deatils = "Border Crossing",
                    Image = "/uploads/addons/AD-1010.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 18,
                    AddOnCode = "AD-1005",
                    AddOnName = "Extra Driver",
                    Price = 5,
                    Deatils = "Extra Driver",
                    Image = "/uploads/addons/AD-1005.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 19,
                    AddOnCode = "AD-1006",
                    AddOnName = "Mobile Wifi",
                    Price = 5,
                    Deatils = "Mobile Wifi",
                    Image = "/uploads/addons/AD-1006.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = true
                },
                new AddOns
                {
                    AddOnID = 20,
                    AddOnCode = "AD-1007",
                    AddOnName = "Snow Chain",
                    Price = 5,
                    Deatils = "Snow Chain",
                    Image = "/uploads/addons/AD-1007.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 21,
                    AddOnCode = "AD-1001",
                    AddOnName = "GPS Navigation",
                    Price = 5,
                    Deatils = "GPS Navigation",
                    Image = "/uploads/addons/AD-1001.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = true
                },
                new AddOns
                {
                    AddOnID = 22,
                    AddOnCode = "AD-1002",
                    AddOnName = "Baby Seat",
                    Price = 15,
                    Deatils = "Baby Seat",
                    Image = "/uploads/addons/AD-1002.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 23,
                    AddOnCode = "AD-1004",
                    AddOnName = "Child Seat",
                    Price = 15,
                    Deatils = "Child Seat",
                    Image = "/uploads/addons/AD-1004.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 24,
                    AddOnCode = "AD-1003",
                    AddOnName = "Toddler Seat",
                    Price = 15,
                    Deatils = "Toddler Seat",
                    Image = "/uploads/addons/AD-1003.jpg",
                    CreatedAt = new DateTime(2025, 7, 7, 12, 41, 53),
                    IsActive = true,
                    IsDeleted = false
                },
                new AddOns
                {
                    AddOnID = 27,
                    AddOnCode = "AD-1012",
                    AddOnName = "Fuel Coverage",
                    Price = 20,
                    Deatils = "Fuel Coverage",
                    Image = "/uploads/addons/AD-1012.jpg",
                    CreatedAt = new DateTime(2025, 9, 5, 9, 48, 37),
                    IsActive = true,
                    IsDeleted = false
                }
            );
        }
    }

    private static void SeedFuelTypes(DatabaseContext context)
    {
        if (!context.FuelTypes.Any())
        {
            context.FuelTypes.AddRange(
                new FuelType
                {
                    FuelTypeID = 1,
                    Name = "Gasoline",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                },
                new FuelType
                {
                    FuelTypeID = 2,
                    Name = "Diesel",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                },
                new FuelType
                {
                    FuelTypeID = 3,
                    Name = "Hybrid",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                },
                new FuelType
                {
                    FuelTypeID = 4,
                    Name = "Electric",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                }
            );
        }
    }

    private static void SeedTransmissions(DatabaseContext context)
    {
        if (!context.Transmissions.Any())
        {
            context.Transmissions.AddRange(
                new Transmission
                {
                    TransmissionID = 1,
                    Name = "Manual",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                },
                new Transmission
                {
                    TransmissionID = 3,
                    Name = "Automatic",
                    CreatedAt = new DateTime(2025, 1, 1),
                    IsActive = true,
                    IsDeleted = false,
                    UserID = null
                }
            );
        }
    }

    private static void SeedVehicleGroup(DatabaseContext context)
    {
        if (!context.VehicleGroups.Any())
        {
            context.VehicleGroups.AddRange(
                new VehicleGroup { GroupID = 2, GroupIntName = "DP Comfort", GroupExtName = "ECMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 3, GroupIntName = "DP Eco Smart", GroupExtName = "CDAR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 4, GroupIntName = "DP  Comfort Plus", GroupExtName = "SDAR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 5, GroupIntName = "DP Compact Explorer", GroupExtName = "CWMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 7, GroupIntName = "DP Family and Group", GroupExtName = "LVAR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 9, GroupIntName = "DP Comfort Class", GroupExtName = "IDAR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 10, GroupIntName = "DP Green City Drive", GroupExtName = "CDAE", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 11, GroupIntName = "DP Adventure SUV", GroupExtName = "IFAR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 12, GroupIntName = "DP E-SUV Explorer", GroupExtName = "IFAE", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 13, GroupIntName = "DP E-Comfort", GroupExtName = "IDAE", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 14, GroupIntName = "DP Mini Flex", GroupExtName = "MCMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 15, GroupIntName = "DP Fuel Saver", GroupExtName = "FKMN/EKMN", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 18, GroupIntName = "DP Mini Style", GroupExtName = "MBMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 19, GroupIntName = "DP  Comfort Plus", GroupExtName = "IDMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 20, GroupIntName = "DP Family and Group", GroupExtName = "LVMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 21, GroupIntName = "DP City Cargo", GroupExtName = "VCMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleGroup { GroupID = 22, GroupIntName = "DP Cargo Max", GroupExtName = "FVMR", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null }
            );
        }
    }

    private static void SeedVehicleBrands(DatabaseContext context)
    {
        if (!context.VehicleBrands.Any())
        {
            context.VehicleBrands.AddRange(
                new VehicleBrand { VehicleBrandID = 1, Name = "Hyundai", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 2, Name = "KIA", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 3, Name = "Opel", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 4, Name = "Dacia", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 5, Name = "Nissan", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 6, Name = "Peugeot", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 7, Name = "Ford", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleBrand { VehicleBrandID = 8, Name = "Fiat", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null }
            );
        }
    }

    private static void SeedVehicleModels(DatabaseContext context)
    {
        if (!context.VehicleModels.Any())
        {
            context.VehicleModels.AddRange(
                new VehicleModel { VehicleModelID = 1, Name = "Astra", BrandID = 3, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 2, Name = "Mokka", BrandID = 3, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 3, Name = "Ceed", BrandID = 2, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 4, Name = "EV3 GT", BrandID = 2, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 5, Name = "Electric", BrandID = 2, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 6, Name = "i30 N", BrandID = 1, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 7, Name = "i20", BrandID = 1, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 8, Name = "i10", BrandID = 1, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 9, Name = "X-Trial", BrandID = 5, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 10, Name = "QashQai", BrandID = 5, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 11, Name = "Transit", BrandID = 7, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 12, Name = "VMT 101", BrandID = 7, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 13, Name = "5008", BrandID = 6, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 14, Name = "208", BrandID = 6, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 15, Name = "2008 GT", BrandID = 6, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 16, Name = "308SW", BrandID = 6, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 17, Name = "500", BrandID = 8, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 18, Name = "Duster", BrandID = 4, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleModel { VehicleModelID = 19, Name = "Jogger", BrandID = 4, CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null }
            );
        }
    }

    private static void SeedVehicleTypes(DatabaseContext context)
    {
        if (!context.VehicleTypes.Any())
        {
            context.VehicleTypes.AddRange(
                new VehicleType { VehicleTypeID = 1, Name = "Mini", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 2, Name = "Economy", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 3, Name = "Compact", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 4, Name = "Station Wagon", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 5, Name = "SUV", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 6, Name = "Electric", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 7, Name = "People Carrier", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 8, Name = "Transporter", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 9, Name = "Business Sedan", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null },
                new VehicleType { VehicleTypeID = 10, Name = "Sports Car", CreatedAt = new DateTime(2025, 1, 1), IsActive = true, IsDeleted = false, UserID = null }
            );
        }
    }

private static void SeedVehicles(DatabaseContext context)
{
    if (!context.Vehicles.Any())
    {
        var vehicles = new List<Vehicle>
        {
            new Vehicle
            {
                VehicleID = 38,
                VehicleCode = "VH-1001",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1001",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth",
                AC = true,
                NoOfSeats = 5,
                Color = "navy blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 2,
                VehicleTypeID = 3,
                BrandID = 1,
                VehicleModelID = 6,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:41:53.4632406"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 39,
                VehicleCode = "VH-1002",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1002",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth",
                AC = true,
                NoOfSeats = 5,
                Color = "Grey",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 2,
                VehicleTypeID = 3,
                BrandID = 3,
                VehicleModelID = 1,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:43:37.9533091"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 40,
                VehicleCode = "VH-1003",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1003",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth",
                AC = true,
                NoOfSeats = 5,
                Color = "Dark Grey",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 2,
                VehicleTypeID = 3,
                BrandID = 2,
                VehicleModelID = 3,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:46:09.3517370"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 41,
                VehicleCode = "VH-1004",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1004",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 6,
                Color = "Blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 4,
                VehicleTypeID = 5,
                BrandID = 4,
                VehicleModelID = 18,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:49:49.6553131"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 42,
                VehicleCode = "VH-1005",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1005",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "White",
                Mileage = 0,
                Luggage = 1,
                ShowOnWebsite = true,
                GroupID = 11,
                VehicleTypeID = 5,
                BrandID = 5,
                VehicleModelID = 9,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:52:51.6432956"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 43,
                VehicleCode = "VH-1006",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1006",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 6,
                Color = "Dark Green",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 11,
                VehicleTypeID = 5,
                BrandID = 5,
                VehicleModelID = 10,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:55:58.1590786"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 44,
                VehicleCode = "VH-1007",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1007",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 6,
                Color = "Blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 11,
                VehicleTypeID = 5,
                BrandID = 6,
                VehicleModelID = 13,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T12:59:50.3036339"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 46,
                VehicleCode = "VH-1008",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1008",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth",
                AC = true,
                NoOfSeats = 5,
                Color = "Red",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 3,
                VehicleTypeID = 2,
                BrandID = 1,
                VehicleModelID = 7,
                TransmissionID = 1,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:06:26.6973479"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 47,
                VehicleCode = "VH-1009",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1009",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth",
                AC = true,
                NoOfSeats = 5,
                Color = "Grey",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 3,
                VehicleTypeID = 2,
                BrandID = 6,
                VehicleModelID = 14,
                TransmissionID = 1,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:08:55.0240665"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 48,
                VehicleCode = "VH-1010",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1010",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "Maroon",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 10,
                VehicleTypeID = 6,
                BrandID = 3,
                VehicleModelID = 2,
                TransmissionID = 3,
                FuelTypeID = 4,
                CreatedAt = DateTime.Parse("2025-07-07T13:10:56.7984510"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 49,
                VehicleCode = "VH-1011",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1011",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "Blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 12,
                VehicleTypeID = 6,
                BrandID = 2,
                VehicleModelID = 5,
                TransmissionID = 3,
                FuelTypeID = 4,
                CreatedAt = DateTime.Parse("2025-07-07T13:12:40.1410011"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 50,
                VehicleCode = "VH-1012",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1012",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "White",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 13,
                VehicleTypeID = 6,
                BrandID = 2,
                VehicleModelID = 4,
                TransmissionID = 3,
                FuelTypeID = 4,
                CreatedAt = DateTime.Parse("2025-07-07T13:14:09.8778922"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 51,
                VehicleCode = "VH-1013",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1013",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "Blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 10,
                VehicleTypeID = 6,
                BrandID = 6,
                VehicleModelID = 15,
                TransmissionID = 3,
                FuelTypeID = 4,
                CreatedAt = DateTime.Parse("2025-07-07T13:16:12.5068204"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 52,
                VehicleCode = "VH-1014",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1014",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "White",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 19,
                VehicleTypeID = 4,
                BrandID = 4,
                VehicleModelID = 19,
                TransmissionID = 1,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:20:32.8034555"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 53,
                VehicleCode = "VH-1015",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1015",
                DailyRate = 20.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "White",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 4,
                VehicleTypeID = 4,
                BrandID = 3,
                VehicleModelID = 1,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:26:30.8462376"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 54,
                VehicleCode = "VH-1016",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1016",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "Black",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 4,
                VehicleTypeID = 4,
                BrandID = 2,
                VehicleModelID = 3,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:27:56.4056684"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 55,
                VehicleCode = "VH-1017",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1017",
                DailyRate = 10.00m,
                Features = "Navigation System, Bluetooth, Rearview Camera, USB Charging, CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 5,
                Color = "Green",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 4,
                VehicleTypeID = 4,
                BrandID = 6,
                VehicleModelID = 16,
                TransmissionID = 3,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:38:13.2171032"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 56,
                VehicleCode = "VH-1018",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1018",
                DailyRate = 10.00m,
                Features = "Good Interior, Bluetooth",
                AC = true,
                NoOfSeats = 4,
                Color = "Blue",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 14,
                VehicleTypeID = 1,
                BrandID = 1,
                VehicleModelID = 8,
                TransmissionID = 1,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:40:11.2802431"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 57,
                VehicleCode = "VH-1019",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1019",
                DailyRate = 10.00m,
                Features = "Good Interior ,Bluetooth",
                AC = true,
                NoOfSeats = 4,
                Color = "Black",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 18,
                VehicleTypeID = 1,
                BrandID = 8,
                VehicleModelID = 17,
                TransmissionID = 1,
                FuelTypeID = 1,
                CreatedAt = DateTime.Parse("2025-07-07T13:41:50.0788771"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 58,
                VehicleCode = "VH-1020",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1020",
                DailyRate = 10.00m,
                Features = "CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 9,
                Color = "White",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 7,
                VehicleTypeID = 7,
                BrandID = 7,
                VehicleModelID = 11,
                TransmissionID = 3,
                FuelTypeID = 2,
                CreatedAt = DateTime.Parse("2025-07-07T13:46:12.2210711"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 59,
                VehicleCode = "VH-1021",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1021",
                DailyRate = 20.00m,
                Features = "CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 8,
                Color = "Black",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 7,
                VehicleTypeID = 7,
                BrandID = 8,
                VehicleModelID = 20,
                TransmissionID = 3,
                FuelTypeID = 2,
                CreatedAt = DateTime.Parse("2025-07-07T13:48:02.3554177"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 60,
                VehicleCode = "VH-1022",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1022",
                DailyRate = 20.00m,
                Features = "CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 8,
                Color = "Silver",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 7,
                VehicleTypeID = 7,
                BrandID = 8,
                VehicleModelID = 12,
                TransmissionID = 3,
                FuelTypeID = 2,
                CreatedAt = DateTime.Parse("2025-07-07T13:50:03.6420458"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 61,
                VehicleCode = "VH-1023",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1023",
                DailyRate = 10.00m,
                Features = "CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 8,
                Color = "White",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 7,
                VehicleTypeID = 7,
                BrandID = 8,
                VehicleModelID = 21,
                TransmissionID = 3,
                FuelTypeID = 2,
                CreatedAt = DateTime.Parse("2025-07-07T13:51:37.2518650"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            },
            new Vehicle
            {
                VehicleID = 62,
                VehicleCode = "VH-1024",
                Status = "Available",
                Year = 2000,
                PlateNumber = "1024",
                DailyRate = 20.00m,
                Features = "CarPlay, Parking Sensors",
                AC = true,
                NoOfSeats = 8,
                Color = "Red",
                Mileage = 0,
                Luggage = 0,
                ShowOnWebsite = true,
                GroupID = 7,
                VehicleTypeID = 7,
                BrandID = 7,
                VehicleModelID = 22,
                TransmissionID = 3,
                FuelTypeID = 2,
                CreatedAt = DateTime.Parse("2025-07-07T13:53:00.8385039"),
                IsActive = true,
                IsDeleted = false,
                UserID = null
            }
        };

        context.Vehicles.AddRange(vehicles);
        context.SaveChanges();
    }
}

}
