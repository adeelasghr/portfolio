using core.entities.client;
using core.entities.contract;
using core.entities.shared;
using core.entities.user;
using core.entities.vehicle;
using Microsoft.EntityFrameworkCore;

namespace infastructure.data;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

    //Customer Module
    public DbSet<Customer> Customers { get; set; }
    public DbSet<CustomerDoc> CustomerDocs { get; set; }

    // Vehicle Module
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<FuelType> FuelTypes { get; set; }
    public DbSet<Transmission> Transmissions { get; set; }
    public DbSet<VehicleBrand> VehicleBrands { get; set; }
    public DbSet<VehicleModel> VehicleModels { get; set; }
    public DbSet<VehicleType> VehicleTypes { get; set; }
    public DbSet<VehicleImage> VehicleImages { get; set; }
    public DbSet<VehicleGroup> VehicleGroups { get; set; }
    public DbSet<VehicleHistory> VehicleHistory { get; set; }

    
    //Contract Module
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<ContractAddOns> ContractAddOns { get; set; }
    public DbSet<ContractFinance> ContractFinances { get; set; }

    //Contract History
    public DbSet<ContractHistory> ContractsHistory { get; set; }
    public DbSet<ContractAddOnsHistory> ContractAddOnsHistory { get; set; }
    public DbSet<ContractFinanceHistory> ContractFinanceHistory { get; set; }
    public DbSet<VehicleChangeHistory> VehicleChangeHistory { get; set; }

    //Add Ons Module
    public DbSet<AddOns> AddOns { get; set; }

    //Inspection Module
    public DbSet<Users> Users { get; set; }

    //Shared Entities
    public DbSet<Location> Locations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       

modelBuilder.Entity<Contract>()
    .HasOne(c => c.Customer)
    .WithMany()
    .HasForeignKey(c => c.CustomerID)
    .OnDelete(DeleteBehavior.NoAction); // <-- stop cascade



        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.FuelType)
            .WithMany()
            .HasForeignKey(v => v.FuelTypeID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Transmission)
            .WithMany()
            .HasForeignKey(v => v.TransmissionID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Brand)
            .WithMany()
            .HasForeignKey(v => v.BrandID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.Model)
            .WithMany()
            .HasForeignKey(v => v.VehicleModelID)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Vehicle>()
            .HasOne(v => v.VehicleType)
            .WithMany()
            .HasForeignKey(v => v.VehicleTypeID)
            .OnDelete(DeleteBehavior.Restrict);
    }
}