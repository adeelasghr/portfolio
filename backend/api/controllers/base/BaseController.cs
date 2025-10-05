using AutoMapper;
using core.interfaces;
using Microsoft.AspNetCore.Mvc;

namespace api;

[ApiController]
[Route("api/[controller]")]
public class BaseController : ControllerBase
{
    protected IUnitOfWork _unitofwork;
    protected IMapper _mapper;

    public BaseController(IMapper mapper, IUnitOfWork unitOfWork)
    {
        _unitofwork = unitOfWork;
        _mapper = mapper;
    }
}
