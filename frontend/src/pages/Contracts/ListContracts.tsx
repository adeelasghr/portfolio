import contract from '../../assets/images/contract.png';
import ContractTable from '../../components/Contracts/ContractTable';
import InnerHeader from '../../components/Shared/InnerHeader';


const ListContracts: React.FC = () => {
 
  return (
    <>
    <div className="flex-1 overflow-y-auto p-4 bg-gray-100 main-bg">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <InnerHeader 
          title="Contract List" 
          breadcrum="Contracts ➞ All Contracts" 
          icon={contract}
          />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1" style={{ minHeight: '70vh'}}>
        <ContractTable />
      </div>
    </div>    
    </>
  );
};

export default ListContracts;