using System.Linq.Expressions;
namespace core.interfaces;

public interface IGenericRepository<T> where T : class
    {
        Task<T?> GetById(int id);
        IQueryable<T> GetAll();
        Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate);
        Task Add(T entity);
        Task Update(T entity);
        Task Remove(int id);
    }