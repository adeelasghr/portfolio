
using AutoMapper;
using core.entities.client;
using core.entities.contract;
using core.entities.vehicle;
using core.interfaces;
using core.utilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using presentation.viewmodel.contract;

namespace api.controllers.contract;

[ApiController]
[Route("api/[controller]")]
public class ContractController : BaseController
{

    public ContractController(IMapper mapper, IUnitOfWork unitOfWork) : base(mapper, unitOfWork) { }

    [HttpGet]
    [Route("GetNewCode")]
    public async Task<IActionResult> GetNewCode()
    {
        string newCode = await _unitofwork.Contracts().GetNextContractCode();
        return Ok(newCode);
    }

    [HttpPost]
    [Route("AddContract")]
    public async Task<IActionResult> AddContract([FromForm] AddContractVM model)
    {
        try
        {
            var contract = _mapper.Map<Contract>(model);
            int? customerID = model.ClientID;
            int? bookingID = model.BookingID;

            #region Checking Customer
            if (customerID == 0)
            {
                Customer newCustomer = new Customer();
                // Adding New Customer
                newCustomer.CustomerCode = await _unitofwork.Customers().GetNextCustomerCode();
                newCustomer.FirstName = model.FirstName ?? string.Empty;
                newCustomer.LastName = model.LastName;
                newCustomer.Email = model.Email ?? string.Empty;
                newCustomer.PhoneNumber = model.Phone;
                newCustomer.StreetName = model.Address;
                newCustomer.City = model.City;
                newCustomer.Country = model.Country;
                newCustomer.DOB = DateTime.Parse(model.DOB ?? "1900-01-01");
                newCustomer.PassportNo = model.PassportNo ?? string.Empty;
                newCustomer.LicenseNo = model.LicenseNo ?? string.Empty;
                newCustomer.LicenseExpiry = DateTime.Parse(model.LicenseExpiry ?? "1900-01-01");
                newCustomer.AccountType = "Elite";

                // Setting up the password
                var tempPassword = _unitofwork.Customers().GenerateRandomPassword();
                var hasher = new PasswordHasher<Customer>();
                newCustomer.HashKey = hasher.HashPassword(newCustomer, tempPassword);

                //Additional Values
                newCustomer.CreatedAt = DateTime.Now;
                newCustomer.IsActive = true;
                newCustomer.IsDeleted = false;

                await _unitofwork.Customers().Add(newCustomer);
                await _unitofwork.SaveChangesAsync();

                //Setting up Customer ID
                customerID = await _unitofwork.Customers().GetCustomerID(newCustomer.Email);
            }
            #endregion

            

            // Setting in addition values
            contract.CustomerID = customerID.Value;
            contract.TaxAmount = Math.Round(contract.TotalAmount * 0.19m, 2);
            contract.ContractCode = await _unitofwork.Contracts().GetNextContractCode();
            contract.CreatedAt = DateTime.Now;
            contract.IsActive = true;
            contract.IsDeleted = false;
            contract.Status = "Active";

            #region signatures
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "signatures");
            Directory.CreateDirectory(uploadPath);
            if (model.Signature != null)
            {
                var extension = Path.GetExtension(model.Signature.FileName);
                var uniqueFileName = $"{Guid.NewGuid()}-{contract.ContractCode}{extension}";
                var filePath = Path.Combine(uploadPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.Signature.CopyToAsync(stream);
                }

                contract.signatures = $"/uploads/signatures/{uniqueFileName}";
            }
            #endregion

            await _unitofwork.Repository<Contract>().Add(contract);
            int result = await _unitofwork.SaveChangesAsync();

            if (result > 0)
            {

                #region Vehiclce History
                var history = new VehicleHistory
                {
                    VehicleID = contract.VehicleID,
                    EventType = "Contract Created",
                    EventDescription = "Contract " + contract.ContractCode + " was started",
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    IsDeleted = false,
                };

                await _unitofwork.Repository<VehicleHistory>().Add(history);
                await _unitofwork.SaveChangesAsync();
                #endregion

                #region Contract Vehicle Change
                var contractVeh = new VehicleChangeHistory
                {
                    VehicleID = contract.VehicleID,
                    ContractID = contract.ContractID,
                    Start = contract.PickupDateTime,
                    End = contract.DropOffDateTime,
                    TotalDays = contract.TotalDays,
                    DailyRate = contract.DailyRent,
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    IsDeleted = false,
                };

                await _unitofwork.Repository<VehicleChangeHistory>().Add(contractVeh);
                await _unitofwork.SaveChangesAsync();
                #endregion

                #region Add Ons
                if (model.AddOns != null && model.AddOns.Count > 0)
                {
                    foreach (var addOn in model.AddOns)
                    {
                        var contractAddOn = new ContractAddOns
                        {
                            ContractID = contract.ContractID,
                            AddOnsID = addOn.ID,
                            AddOnDetail = addOn.Name,
                            AddOnsPrice = addOn.Price
                        };

                        await _unitofwork.Repository<ContractAddOns>().Add(contractAddOn);
                    }
                    await _unitofwork.SaveChangesAsync();
                }
                #endregion

                #region Finances

                var vehicle = await _unitofwork.Vehicles().GetVehicleBrief(contract.VehicleID);
                var rental = new ContractFinance
                {
                    ContractID = contract.ContractID,
                    Amount = contract.DailyRent,
                    CreatedAt = DateTime.Now,
                    IsActive = true,
                    IsDeleted = false,
                    Quantity = contract.TotalDays,
                    Total = Math.Round(contract.DailyRent * contract.TotalDays, 2),
                    FinanceItemID = 1,
                    Remarks = vehicle[0].makeModel + " (" + vehicle[0].plateNumber + ")"
                };
                await _unitofwork.Repository<ContractFinance>().Add(rental);

                //Checking for Add Ons
                if (model.AddOns != null && model.AddOns.Count > 0)
                {
                    var addOn = new ContractFinance
                    {
                        ContractID = contract.ContractID,
                        Amount = contract.AdditionalCharges,
                        CreatedAt = DateTime.Now,
                        IsActive = true,
                        IsDeleted = false,
                        Quantity = 0,
                        Total = Math.Round(contract.AdditionalCharges, 2),
                        FinanceItemID = 2,
                        Remarks = " "
                    };
                    await _unitofwork.Repository<ContractFinance>().Add(addOn);
                }

                //Checking for Extra Charges
                if (contract.OtherCharges > 0)
                {
                    var other = new ContractFinance
                    {
                        ContractID = contract.ContractID,
                        Amount = contract.OtherCharges,
                        CreatedAt = DateTime.Now,
                        IsActive = true,
                        IsDeleted = false,
                        Quantity = 1,
                        Total = contract.OtherCharges,
                        FinanceItemID = 3,
                        Remarks = " "
                    };
                    await _unitofwork.Repository<ContractFinance>().Add(other);
                }

                await _unitofwork.SaveChangesAsync();
                #endregion


                //Sending Confirmation Emails (Client and Admin)
                return Ok(new { message = "Contract has been created successfully." });
            }
            else
            {
                return StatusCode(500, new { message = "An error occurred while saving the contract." });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpGet]
    [Route("GetBrief")]
    public async Task<IActionResult> GetBrief(int? id = null)
    {
        if (id.HasValue)
        {
            var contract = await _unitofwork.Contracts().GetContractBrief(id.Value);
            if (contract is null)
                return NotFound();
            return Ok(contract);
        }
        else
        {
            var contract = await _unitofwork.Contracts().GetContractBrief();
            if (contract is null)
                return NotFound();
            return Ok(contract);
        }
    }

    [HttpGet]
    [Route("GetCalendar")]
    public async Task<IActionResult> GetCalendar(DateTime startDate, DateTime endDate)
    {
        var booking = await _unitofwork.Contracts().GetContractCalendar(startDate, endDate);
        return Ok(booking);
    }

    [HttpGet("Print")]
    public async Task<ActionResult<PrintContractVM>> Print(int id)
    {
        var contract = await _unitofwork.Contracts().PrintContract(id);
        if (contract is null)
            return NotFound();
        return Ok(contract);
    }

    // [HttpGet("Timeline")]
    // public async Task<ActionResult<ContractTimelineVM>> Timeline(int id)
    // {
    //     var contract = await _unitofwork.Contracts().GetContractTimeline(id);
    //     if (contract is null)
    //         return NotFound();
    //     return Ok(contract);
    // }

    [HttpGet("Overview")]
    public async Task<ActionResult<ContractOverviewVM>> Overview(int id)
    {
        var contract = await _unitofwork.Contracts().ContractOverview(id);
        if (contract is null)
            return NotFound();
        return Ok(contract);
    }

    [HttpPost]
    [Route("Close")]
    public async Task<ActionResult> CloseContract([FromForm] CloseContractVM model)
    {
        var contract = await _unitofwork.Contracts().GetById(model.ContractID);

        if (contract == null)
            return NotFound($"Contract with ID {model.ContractID} not found.");

        contract.endFuelReading = model.EndFuelReading;
        contract.EndMileage = model.EndMileage;
        contract.Discount = model.Discount.ToDecimal();
        contract.TotalAmount = model.TotalAmount.ToDecimal() + model.Discount.ToDecimal();
        contract.TaxAmount = model.TaxAmount.ToDecimal();
        contract.Status = "Closed";
        contract.Remarks = contract.Remarks + " - " + model.Remarks;


        #region signatures
        if (model.Signature != null && model.Signature.Length > 0)
        {
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", "signatures");
            Directory.CreateDirectory(uploadPath);
            var extension = Path.GetExtension(model.Signature.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}-{contract.ContractCode}{extension}";
            var filePath = Path.Combine(uploadPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await model.Signature.CopyToAsync(stream);
            }

            contract.ClosingSignatures = $"/uploads/signatures/{uniqueFileName}";
        }
        #endregion

        #region Extra Charges
        //Checking for Extra Charges on Contract Closing
        if (model.ExcessiveCleaning.ToDecimal() > 0)
        {
            var Cleaning = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.ExcessiveCleaning.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.ExcessiveCleaning.ToDecimal(),
                FinanceItemID = 5,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Cleaning);
        }
        if (model.DamageCharges.ToDecimal() > 0)
        {
            var Damage = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.DamageCharges.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.DamageCharges.ToDecimal(),
                FinanceItemID = 6,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Damage);
        }
        if (model.MissingAccessory.ToDecimal() > 0)
        {
            var Missing = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.MissingAccessory.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.MissingAccessory.ToDecimal(),
                FinanceItemID = 7,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Missing);
        }
        if (model.ExcessMilage.ToDecimal() > 0)
        {
            var Excess = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.ExcessMilage.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.ExcessMilage.ToDecimal(),
                FinanceItemID = 8,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Excess);
        }
        if (model.LateReturn.ToDecimal() > 0)
        {
            var Late = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.LateReturn.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.LateReturn.ToDecimal(),
                FinanceItemID = 9,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Late);
        }
        if (model.FuelAdjustment.ToDecimal() > 0)
        {
            var Fuel = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.FuelAdjustment.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.FuelAdjustment.ToDecimal(),
                FinanceItemID = 7,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Fuel);
        }

        await _unitofwork.SaveChangesAsync();
        #endregion

        if (contract == null)
            throw new KeyNotFoundException($"Contract with ID {model.ContractID} not found.");

        await _unitofwork.Repository<Contract>().Update(contract);
        var result = await _unitofwork.SaveChangesAsync();
        if (result > 0)
        {

            #region Vehicle History
            //Adding Vehiclce History
            var history = new VehicleHistory
            {
                VehicleID = contract.VehicleID,
                EventType = "Contract Closed",
                EventDescription = "Contract " + contract.ContractCode + " was ended.",
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
            };

            await _unitofwork.Repository<VehicleHistory>().Add(history);
            await _unitofwork.SaveChangesAsync();
            #endregion

        }

        return Ok(contract);
    }

    [HttpGet]
    [Route("GetDetails")]
    public async Task<IActionResult> GetDetails(int? id)
    {
        if (id.HasValue)
        {
            var contract = await _unitofwork.Contracts().GetContractBrief(id.Value);
            if (contract is null)
                return NotFound();
            return Ok(contract);
        }
        else
        {
            var contract = await _unitofwork.Contracts().GetContractBrief();
            if (contract is null)
                return NotFound();
            return Ok(contract);
        }
    }

    [HttpGet]
    [Route("GetDetailsForEdit")]
    public async Task<IActionResult> GetDetailsForEdit(int id)
    {
        var contract = await _unitofwork.Contracts().GetDetails(id);
        if (contract is null)
            return NotFound();
        return Ok(contract);
    }

    [HttpPatch]
    [Route("UpdateContract")]
    public async Task<IActionResult> UpdateCustomer(UpdateContractVM model)
    {
        //Fetching Contract
        var existContract = await _unitofwork.Repository<Contract>().GetById(model.ContractID);
        if (existContract is null)
            return NotFound();

        //Archiving Contract to History
        await _unitofwork.Contracts().ArchiveContract(model.ContractID, 1);
        _mapper.Map(model, existContract);

        await _unitofwork.Repository<Contract>().Update(existContract);
        await _unitofwork.SaveChangesAsync();

        #region Add Ons
        if (model.AddOns != null && model.AddOns.Count > 0)
        {
            foreach (var addOn in model.AddOns)
            {
                var contractAddOn = new ContractAddOns
                {
                    ContractID = model.ContractID,
                    AddOnsID = addOn.ID,
                    AddOnDetail = addOn.Name,
                    AddOnsPrice = addOn.Price
                };

                await _unitofwork.Repository<ContractAddOns>().Add(contractAddOn);
            }
            await _unitofwork.SaveChangesAsync();
        }
        #endregion

        // Checking Vehcile Change
        if (model.VehicleID != existContract.VehicleID)
        {
            //Maintain Vehicle Change History
            #region Contract Vehicle Change

            //Adding New Vehicle Change Entry
            var totalDaysNew = (int)Math.Ceiling((model.DropOffDateTime!.Value - DateTime.Now).TotalDays);
            var contractVeh = new VehicleChangeHistory
            {
                VehicleID = model.VehicleID,
                ContractID = model.ContractID,
                Start = DateTime.Now,
                End = (DateTime)model.DropOffDateTime,
                TotalDays = totalDaysNew,
                DailyRate = model.DailyRent.ToDecimal(),
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
            };

            await _unitofwork.Repository<VehicleChangeHistory>().Add(contractVeh);
            await _unitofwork.SaveChangesAsync();
            #endregion

            //Adding All Changes to Finanace 

        }

        #region Finances
        var vehicle = await _unitofwork.Vehicles().GetVehicleBrief(model.VehicleID);
        var rentalDetails = await _unitofwork.VehicleChangeHistory().GetAllEntries(model.ContractID);
        foreach (var detail in rentalDetails)
        {
            var rental = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = detail.DailyRate, // take daily rate from history
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = detail.TotalDays,
                Total = Math.Round(detail.DailyRate * detail.TotalDays, 2),
                FinanceItemID = 1, // hard-coded? consider dynamic if needed
                Remarks = $"{vehicle[0].makeModel} ({vehicle[0].plateNumber})"
            };

            await _unitofwork.Repository<ContractFinance>().Add(rental);
        }
        await _unitofwork.SaveChangesAsync();

        //Checking for Add Ons
        if (model.AddOns != null && model.AddOns.Count > 0)
        {
            decimal additional = model.AdditionalCharges.ToDecimal();

            var addOn = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = additional,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = additional,
                FinanceItemID = 2,
                Remarks = " "
            };
            await _unitofwork.Repository<ContractFinance>().Add(addOn);
        }

        decimal otherCh = model.OtherCharges.ToDecimal();
        //Checking for Extra Charges
        if (otherCh > 0)
        {
            var other = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = otherCh,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 1,
                Total = otherCh,
                FinanceItemID = 3,
                Remarks = " "
            };
            await _unitofwork.Repository<ContractFinance>().Add(other);

            await _unitofwork.SaveChangesAsync();
        }

        #endregion

        return Ok();
    }

    [HttpGet("GetClose")]
    public async Task<ActionResult<GetCloseContractVM>> GetDetailsForClose(int id)
    {
        var contract = await _unitofwork.Contracts().GetDetailsForClose(id);
        if (contract is null)
            return NotFound();
        return Ok(contract);
    }

    [HttpGet("GetEditClose")]
    public async Task<ActionResult<GetEditClosedContractVM>> GetDetailsForEditClose(int id)
    {
        var contract = await _unitofwork.Contracts().GetDetailsForEditClose(id);
        if (contract is null)
            return NotFound();
        return Ok(contract);
    }

    [HttpGet]
    [Route("CancelContract")]
    public async Task<IActionResult> CancelContract(int id, string remarks)
    {
        var contract = await _unitofwork.Repository<Contract>().GetById(id);

        if (contract == null)
            return NotFound("Contract not found.");

        contract.Status = "Cancelled";
        contract.Remarks = remarks + " - " + DateTime.Now.ToShortDateString();

        await _unitofwork.Repository<Contract>().Update(contract);
        await _unitofwork.SaveChangesAsync();

        return Ok();
    }

    [HttpPatch]
    [Route("ChangeClosedContract")]
    public async Task<IActionResult> ChangeClosedContract([FromForm] GetEditClosedContractVM model)
    {
        var contract = await _unitofwork.Repository<Contract>().GetById(model.ContractID);

        if (contract == null)
            return NotFound("Contract not found.");

        #region Updating Contract
        contract.Discount = model.Discount;
        contract.AdditionalCharges = model.AdditionalCharges;
        contract.TaxAmount = model.TaxAmount;
        contract.TotalAmount = model.TotalAmount + model.Discount;

        await _unitofwork.Repository<Contract>().Update(contract);
        var result = await _unitofwork.SaveChangesAsync();
        #endregion

        #region Removing Old Contract Finance
        var oldFinanceRecords = _unitofwork.Repository<ContractFinance>()
        .GetAll().Where(x => x.ContractID == model.ContractID
             && new int[] { 5, 6, 7, 8, 9, 10 }.Contains(x.FinanceItemID))
        .ToList();

        if (oldFinanceRecords != null && oldFinanceRecords.Any())
        {
            foreach (var record in oldFinanceRecords)
            {
                await _unitofwork.Repository<ContractFinance>().Remove(record.ContractFinanceID);
            }
            await _unitofwork.SaveChangesAsync();
        }
        #endregion

        #region Updating Contract Finance
        //Checking for Extra Charges on Contract Closing
        if (model.ExcessiveCleaning > 0)
        {
            var Cleaning = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.ExcessiveCleaning,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.ExcessiveCleaning,
                FinanceItemID = 5,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Cleaning);
        }
        if (model.DamageCharges > 0)
        {
            var Damage = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.DamageCharges,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.DamageCharges,
                FinanceItemID = 6,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Damage);
        }
        if (model.MissingAccessory > 0)
        {
            var Missing = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.MissingAccessory,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.MissingAccessory,
                FinanceItemID = 7,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Missing);
        }
        if (model.ExcessMilage > 0)
        {
            var Excess = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.ExcessMilage,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.ExcessMilage,
                FinanceItemID = 8,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Excess);
        }
        if (model.LateReturn > 0)
        {
            var Late = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.LateReturn,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.LateReturn,
                FinanceItemID = 9,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Late);
        }
        if (model.FuelAdjustment > 0)
        {
            var Fuel = new ContractFinance
            {
                ContractID = model.ContractID,
                Amount = model.FuelAdjustment,
                CreatedAt = DateTime.Now,
                IsActive = true,
                IsDeleted = false,
                Quantity = 0,
                Total = model.FuelAdjustment,
                FinanceItemID = 10,
                Remarks = ""
            };
            await _unitofwork.Repository<ContractFinance>().Add(Fuel);
        }

        await _unitofwork.SaveChangesAsync();
        #endregion

        return Ok("Contract updated successfully.");
    }

}