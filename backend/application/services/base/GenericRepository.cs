using System.Linq.Expressions;
using core.entities;
using core.interfaces;
using infastructure.data;
using Microsoft.EntityFrameworkCore;

namespace application.services;

public class GenericRepository<T> : IGenericRepository<T> where T : BaseEntity
{
    protected DatabaseContext _dbContext;
    protected DbSet<T> _dbSet;

    public GenericRepository(DatabaseContext dbContext)
    {
        _dbContext = dbContext;
        _dbSet = _dbContext.Set<T>();
    }

    public async Task Add(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task Update(T entity)
    {
        _dbSet.Attach(entity);
        _dbContext.Entry(entity).State = EntityState.Modified;
    }

    public async Task Remove(int id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
        {
            var prop = entity.GetType().GetProperty("IsDeleted");
            if (prop != null && prop.PropertyType == typeof(bool))
            {
                prop.SetValue(entity, true);
                _dbContext.Entry(entity).State = EntityState.Modified;
            }
        }
    }

    public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.Where(predicate).ToListAsync();
    }

    //virtual because it may need to override
    public virtual IQueryable<T> GetAll()
    {
        return _dbSet
            .Where(e => !e.IsDeleted)
            .OrderByDescending(e => e.CreatedAt)
            .AsQueryable();
    }


    public async Task<T?> GetById(int id) => await _dbSet.FindAsync(id);

    public async Task<bool> AnyAsync(Expression<Func<T, bool>> predicate)
    {
        return await _dbSet.AnyAsync(predicate);
    }

}
