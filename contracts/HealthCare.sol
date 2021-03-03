
pragma solidity >=0.4.22 <0.8.0;
contract HealthCare { 
  mapping(address => string) public roles; 
  uint public hospitalCount = 0;
  uint public doctorCount = 0;
  uint public insuranceCount = 0;
  uint public patientCount = 0;
  uint public appointmentCount = 0;
  uint public fileSharingCount = 0;
  address public admin; 
  struct Hospital {
    uint id;
    address addr;
    string name;
    string regId;    
    string description;
    string _approved;
    string extrafields;
  }
  mapping(uint => Hospital) public hospitals;
  struct Doctor {
    uint id;
    address addr;
    string name;
    uint hospitalid;
    string regId;   
    string _approved;
    string extrafields;
  }
  mapping(uint => Doctor) public doctors;
  struct InsuranceProvider {
    uint id;
    address addr;
    string name;    
    string regId;   
    string _approved;
    string extrafields;
  }
  mapping(uint => InsuranceProvider) public insuranceproviders ;
  struct Patient {
    uint id;
    address addr;
    string name;    
    uint insuranceProviderid;   
    uint familyDoctorid; 
    string _approved;
    string extrafields;
    string filehashes;
  }
  mapping(uint => Patient) public patients;
  struct Appointment {
    uint id;       
    uint patientid;   
    uint doctorid;     
    string date; 
    string time;   
  }
  mapping(uint => Appointment) public appointments;
  struct FileSharing {
    uint id;       
    uint patientid;   
    uint doctorid;     
    string filehash;      
  }
  mapping(uint => FileSharing) public filesharings;
  constructor() public {  
    admin=msg.sender;    
  }
  function registerHospital (string memory _name,string memory _regId,string memory _description,string memory _approved,string memory _extrafields) public {
        require(bytes(roles[msg.sender]).length==0);
        hospitalCount ++;
        hospitals[hospitalCount] = Hospital(hospitalCount,msg.sender,_name,_regId,_description,_approved,_extrafields);    
        roles[msg.sender]="1";   
        //emit registeredEvent(msg.sender);
    } 
     function updateHospital (uint id,string memory _name,string memory _regId,string memory _description,string memory _approved,string memory _extrafields) public {       
        hospitals[id] = Hospital(id,msg.sender,_name,_regId,_description,_approved,_extrafields);    
    } 
  function registerDoctor (string memory _name,uint _hospitalId,string memory _regId,string memory _approved,string memory _extrafields) public {
        require(bytes(roles[msg.sender]).length==0);
        doctorCount ++;
        doctors[doctorCount] = Doctor(doctorCount,msg.sender,_name,_hospitalId,_regId,_approved,_extrafields);    
        roles[msg.sender]="2";   
        //emit registeredEvent(msg.sender);
    } 
    function updaterDoctor (uint id,string memory _name,uint _hospitalId,string memory _regId,string memory _approved,string memory _extrafields) public {
        doctors[id] = Doctor(id,msg.sender,_name,_hospitalId,_regId,_approved,_extrafields);   
    } 
     function registerPatient (string memory _name,uint _insuranceProviderId,uint _familyDoctorId,string memory _approved,string memory _extrafields,string memory _filehashes) public {
        require(bytes(roles[msg.sender]).length==0);
        patientCount ++;
        patients[patientCount] = Patient(patientCount,msg.sender,_name,_insuranceProviderId,_familyDoctorId,_approved,_extrafields,_filehashes);    
        roles[msg.sender]="3";   
        //emit registeredEvent(msg.sender);
    } 
    function updatePatient (uint id,string memory _name,uint _insuranceProviderId,uint _familyDoctorId,string memory _approved,string memory _extrafields) public {
        string memory _filehashes=patients[id].filehashes;
        patients[id] = Patient(id,msg.sender,_name,_insuranceProviderId,_familyDoctorId,_approved,_extrafields,_filehashes);    
    } 
    function registerInsuranceProvider (string memory _name,string memory _regId,string memory _approved,string memory _extrafields) public {
        require(bytes(roles[msg.sender]).length==0);
        insuranceCount ++;
        insuranceproviders[insuranceCount] = InsuranceProvider(insuranceCount,msg.sender,_name,_regId,_approved,_extrafields);    
        roles[msg.sender]="4";   
        //emit registeredEvent(msg.sender);
    } 
    function updateInsuranceProvider (uint id,string memory _name,string memory _regId,string memory _approved,string memory _extrafields) public {
        insuranceproviders[id] = InsuranceProvider(id,msg.sender,_name,_regId,_approved,_extrafields);
    } 
    function addAppointment (uint _patientid,uint _doctorid,string memory _date,string memory _time ) public {
        //require(bytes(roles[msg.sender]).length==0);
        appointmentCount ++;
        appointments[appointmentCount] = Appointment(appointmentCount,_patientid,_doctorid,_date,_time);    
        
        //emit registeredEvent(msg.sender);
    } 
    function addFileSharing (uint _patientid,uint _doctorid,string memory _filehash ) public {
        //require(bytes(roles[msg.sender]).length==0);
        fileSharingCount ++;
        filesharings[fileSharingCount] = FileSharing(fileSharingCount,_patientid,_doctorid,_filehash);    
        
        //emit registeredEvent(msg.sender);
    } 

}
