
pragma solidity >=0.4.22 <0.8.0;

contract HealthCare { 
  mapping(address => string) public roles; 
  uint public hospitalCount = 0;
  uint public doctorCount = 0;
  uint public insuranceCount = 0;
  address public admin; 
  struct Hospital {
    uint id;
    address addr;
    string name;
    string regId;
    //string website;
    //string phone;
    //string email;
    //string hosaddress;
    //string country;
    //string state;
    //string city;
    //string postalcode;
    //string openingTime;
    //string closingTime;
    string description;
    string _approved;
  }
  mapping(uint => Hospital) public hospitals;
  struct Doctor {
    uint id;
    address addr;
    string name;
    uint hospitalid;
    string regId;   
    string _approved;
  }
  mapping(uint => Doctor) public doctors;
  struct InsuranceProvider {
    uint id;
    address addr;
    string name;    
    string regId;   
    string _approved;
  }
  mapping(uint => InsuranceProvider) public insuranceproviders;
  constructor() public {  
    admin=msg.sender;    
  }
  function registerHospital (string memory _name,string memory _regId,string memory _description,string memory _approved) public {
        require(bytes(roles[msg.sender]).length==0);
        hospitalCount ++;
        hospitals[hospitalCount] = Hospital(hospitalCount,msg.sender,_name,_regId,_description,_approved);    
        roles[msg.sender]="1";   
        //emit registeredEvent(msg.sender);
    } 
  function registerDoctor (string memory _name,uint _hospitalId,string memory _regId,string memory _approved) public {
        require(bytes(roles[msg.sender]).length==0);
        doctorCount ++;
        doctors[doctorCount] = Doctor(doctorCount,msg.sender,_name,_hospitalId,_regId,_approved);    
        roles[msg.sender]="2";   
        //emit registeredEvent(msg.sender);
    } 
    function registerInsuranceProvider (string memory _name,string memory _regId,string memory _approved) public {
        require(bytes(roles[msg.sender]).length==0);
        insuranceCount ++;
        insuranceproviders[insuranceCount] = InsuranceProvider(doctorCount,msg.sender,_name,_regId,_approved);    
        roles[msg.sender]="4";   
        //emit registeredEvent(msg.sender);
    } 
}
