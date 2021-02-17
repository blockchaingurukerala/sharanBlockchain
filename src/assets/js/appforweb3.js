App = {
  loading: false,
  contracts: {},
  manfdisplay:0,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
  },

  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    //var Web3 = require('web3')  ;  
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {

      //web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

      window.alert("Please connect to Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        App.acc=await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */})
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */})
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  },

  loadAccount: async () => {
    // Set the current blockchain account
    App.account = App.acc[0];  
    //window.alert(App.account);
    
  },
  loadContract: async () => {
    // Create a JavaScript version of the smart contract
    const HealthCare = await $.getJSON('HealthCare.json')
    App.contracts.HealthCare = TruffleContract(HealthCare)
    App.contracts.HealthCare.setProvider(App.web3Provider)
    // Hydrate the smart contract with values from the blockchain
    App.healthcare = await App.contracts.HealthCare.deployed()
  },
  render: async () => {
    // Prevent double render
    if (App.loading==true) {
      return
    }
    // Update app loading state
      App.loading=true;
      var home = $("#home");
      var selectUserForRegistration = $("#selectUserForRegistration");
      var addhospital = $("#addhospital");
      var dashboardhealthprovider = $("#dashboardhealthprovider");
      var dashboarddoctor = $("#dashboarddoctor");
      var dashboardpatient = $("#dashboardpatient");
      var dashboardinsuranceprovider = $("#dashboardinsuranceprovider");
      var addDoctor = $("#addDoctor");
      var addInsurance = $("#addInsurance");
      var addPatient = $("#addPatient");
      //var loader = $("#loader");      
      var role=await App.healthcare.roles(App.account); 
      //window.alert(role);
      if(role=="1"){
        //HealthCare
        var hospitalId=0;
        //Load Health Provider Details
        var hospitalcount=await App.healthcare.hospitalCount();       
        for (var i = 1; i <= hospitalcount; i++) {
          var hospital=await App.healthcare.hospitals(i);         
          var hospitaladdress=hospital.addr;
          if(hospitaladdress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
            var hospitalName=hospital.name;
            var hospitalRegID=hospital.regId;
            var hospitalDescription=hospital.description;
            var extrafields=hospital.extrafields.split("?");
           // window.alert(hospitalName);
            $("#hospitalname1").html(hospitalName);
            $("#hospitalRegID").html(hospitalRegID);
            $("#hospitalDescription").html(hospitalDescription);            
            $("#hospitalwebsite1").html(extrafields[0]);
            $("#hospitalphone1").html(extrafields[1]);
            $("#hospitalemail1").html(extrafields[2]);
            $("#hospitalAddress").html(extrafields[3]+","+extrafields[4]+","+extrafields[5]+","+extrafields[6]+","+extrafields[7]);
            $("#hospitalopeningTime").html(extrafields[8]);
            $("#hospitalClosingTime").html(extrafields[9]);            
            hospitalId=i;
            break;
          }
        }
        //Load Doctors work on this hospital
        var doctorcount=await App.healthcare.doctorCount();
        for (var i = 1; i <= doctorcount; i++) {
          var doctor=await App.healthcare.doctors(i);
          if(doctor.hospitalid==hospitalId){
            //this doctor works on this hospitals
            window.alert("doctor="+doctor.name);
          }
        }
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.show();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
      }
      else if(role=="2"){
        //Doctor
        var doctorcount=await App.healthcare.doctorCount();       
        for (var i = 1; i <= doctorcount; i++) {
          var doctor=await App.healthcare.doctors(i);         
          var doctoraddress=doctor.addr;
          if(doctoraddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
            var doctorname=doctor.name;
            var doctorRegID=doctor.regId;
            var hospitalid=doctor.hospitalid;
            var hospitalname=await App.healthcare.hospitals(hospitalid)            
             //console.log(hospitalname.name);
            $("#docprofilename").html(doctorname);
            $("#docprofileRegID").html(doctorRegID);
            $("#docprofilehospitalname").html(hospitalname.name);
            var extrafields=doctor.extrafields.split("?");
            $("#docprofileDob").html(extrafields[0]);
            $("#docprofilephone").html(extrafields[2]);
            $("#docprofileaddress").html(extrafields[5]+","+extrafields[6]+","+extrafields[7]+","+extrafields[8]+","+extrafields[9]);
            $("#docprofilename1").html(doctorname);
            $("#docprofilegender").html(extrafields[1]);
            window.alert(extrafields[1])
            $("#docprofileemail").html(extrafields[3]);
            $("#docprofilespecialization").html(extrafields[4]);
            $("#docprofilebiodata").html(extrafields[10]);           
            break;
          }
        }
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.show();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
      }
      else if(role=="3"){
        //Patient

        var patientCount=await App.healthcare.patientCount();       
        for (var i = 1; i <= patientCount; i++) {
          var patient=await App.healthcare.patients(i);         
          var patientaddress=patient.addr;
          if(patientaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
            var patientname=patient.name;
            $("#patientname").html(patientname);
            var familyDoctorid=patient.familyDoctorid;
            var insuranceProviderid=patient.insuranceProviderid;
            var doctor=await App.healthcare.doctors(familyDoctorid) ;
            var insurance=await App.healthcare.insuranceproviders(insuranceProviderid)  ;          
             //console.log(hospitalname.name);
            $("#patprofilename").html(patientname);
            $("#patprofileinsurance").html(insurance.name);
            $("#patprofilefamilydoctor").html(doctor.name);
            var extrafields=patient.extrafields.split("?");
            $("#patprofiledob").html(extrafields[0]);
            $("#patprofilephone").html(extrafields[2]);
            $("#patprofileaddress").html(extrafields[5]+","+extrafields[6]+","+extrafields[7]+","+extrafields[8]+","+extrafields[9]);
           
            $("#patprofilegender").html(extrafields[1]);
           
            $("#patprofileemail").html(extrafields[3]);
            $("#patprofileinsuranceId").html(extrafields[4]);                      
            break;
          }
        }
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.show();
        dashboardinsuranceprovider.hide();

      }
      else if(role=="4"){
        //Insurance
        var insuranceCount=await App.healthcare.insuranceCount();       
        for (var i = 1; i <= insuranceCount; i++) {
          var insurance=await App.healthcare.insuranceproviders(i);         
          var insuranceaddress=insurance.addr;
          if(insuranceaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
            var insurancename=insurance.name;
            var insuranceRegID=insurance.regId;                     
            
            $("#isuprofname").html(insurancename);
            $("#isuprofregid").html(insuranceRegID);            
            var extrafields=insurance.extrafields.split("?");
            $("#isuprofwebsite").html(extrafields[0]);
            $("#isuprofphone").html(extrafields[1]);
            $("#isuprofemail").html(extrafields[2]);
            $("#isuprofaddress").html(extrafields[3]+","+extrafields[4]+","+extrafields[5]+","+extrafields[6]+","+extrafields[7]);           
            $("#isuprofdescription").html(extrafields[8]);                   
            break;
          }
        }
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.show();
      }
      else{
        //New User
        home.hide();
        selectUserForRegistration.show();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
      }
      App.loading=false;
  },
  bookAppointmentByPatient : async()=>{
    $("#selectDoctorforBookingbypatient").empty();
    var doctorcount=await App.healthcare.doctorCount();       
    for (var i = 1; i <= doctorcount; i++) {
      var doctor=await App.healthcare.doctors(i);
      var str="<option value='"+i.toString()+"'>"+doctor.name+"</option>";      
      $("#selectDoctorforBookingbypatient").append(str);
    }
    $("#patientmain").hide();
    $("#patientbooking").show();    
  },
  createAppointmentByPatient :async()=>{


    var patientCount=await App.healthcare.patientCount(); 
    var patientid=0;      
    for (var i = 1; i <= patientCount; i++) {
      var patient=await App.healthcare.patients(i);         
      var patientaddress=patient.addr;
      if(patientaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
        patientid=i;
        break;
      }
    }
    var doctorid=$("#selectDoctorforBookingbypatient").val();
    var appointmentdate=$("#bookingdatebypatient").val();
    var appointmenttime=$("#bookingtimebypatient").val();
    //window.alert("Doctor Id="+doctorid)
    //await App.healthcare.addAppointment(parseInt(patientid),parseInt(doctorid),appointmentdate,appointmenttime, { from: App.account }); 
    
  },
  addHospital:async()=>{    
    var hospitalname=$("#hospitalname").val();
    var hospitalid=$("#hospitalid").val(); 
    var hospitaldescription=$("#hospitaldescription").val(); 
    //Extra Fields
    var hospitalwebsite=$("#hospitalwebsite").val();
    var hospitalphone=$("#hospitalphone").val();
    var hospitalemail=$("#hospitalemail").val();
    var hospitaladdress=$("#hospitaladdress").val();
    var hospitalcountry=$("#hospitalcountry").val();
    var hospitalstate=$("#hospitalstate").val();
    var hospitalcity=$("#hospitalcity").val();
    var hospitalpostalcode=$("#hospitalpostalcode").val();
    var hospitalopeningtime=$("#hospitalopeningtime").val();
    var hospitalclosingtime=$("#hospitalclosingtime").val();    
    var extrafields=hospitalwebsite+"?"+hospitalphone+"?"+hospitalemail+"?"+hospitaladdress+"?"+hospitalcountry+"?"+hospitalstate+"?"+hospitalcity+"?"+hospitalpostalcode+"?"+hospitalopeningtime+"?"+hospitalclosingtime;
    //Extra fields ends
    //window.alert(hospitalname+hospitalid+hospitaldescription);
    //window.alert(extrafields);
    await App.healthcare.registerHospital(hospitalname,hospitalid,hospitaldescription,"false",extrafields, { from: App.account }); 
    window.alert("added successfully"); 
    await App.render();
  },
  addDoctor:async()=>{    
    var docFName=$("#docFName").val();
    var docLName=$("#docLName").val();
    var docFullname=docFName+" "+docLName;
    var hospitalSelect=$("#hospitalSelect").val();  
    var docRegId=$("#docRegId").val(); 
    //window.alert(docFullname +hospitalSelect +docRegId);
    //Reading Extra fields
    var docDoB=$("#docDoB").val();
    var docgender = $("input[name='docgender']:checked").val();
   
    var docphone=$("#docphone").val(); 
    var docemail=$("#docemail").val(); 
    var docspecialization=$("#docspecialization").val(); 
    var docaddress=$("#docaddress").val(); 
    var doccountry=$("#doccountry").val(); 
    var docstate=$("#docstate").val(); 
    var doccity=$("#doccity").val(); 
    var docpostalcode=$("#docpostalcode").val(); 
    var docbiodata=$("#docbiodata").val(); 
    var extrafields=docDoB+"?"+docgender+"?"+docphone+"?"+docemail+"?"+docspecialization+"?"+docaddress+"?"+doccountry+"?"+docstate+"?"+doccity+"?"+docpostalcode+"?"+docbiodata;
    
    //Extra fields ends
    await App.healthcare.registerDoctor(docFullname,parseInt(hospitalSelect),docRegId,"false",extrafields, { from: App.account }); 
    //.alert("added successfully"); 
    await App.render();
  },
  addInsurance:async()=>{    
    var insuName=$("#insuName").val();
    var insuRegId=$("#insuRegId").val();

     //Reading Extra fields
     var addinsuwebsite=$("#addinsuwebsite").val();  
     var addinsuphone=$("#addinsuphone").val(); 
     var addinsuemail=$("#addinsuemail").val(); 
     var addinsuaddress=$("#addinsuaddress").val(); 
     var addinsucountry=$("#addinsucountry").val(); 
     var addinsustate=$("#addinsustate").val(); 
     var addinsucity=$("#addinsucity").val(); 
     var addinsupostalcode=$("#addinsupostalcode").val(); 
     var addinsudescription=$("#addinsudescription").val(); 
    
     var extrafields=addinsuwebsite+"?"+addinsuphone+"?"+addinsuemail+"?"+addinsuaddress+"?"+addinsucountry+"?"+addinsustate+"?"+addinsucity+"?"+addinsupostalcode+"?"+addinsudescription;
     
     //Extra fields ends
    //window.alert(insuName +insuRegId );
    await App.healthcare.registerInsuranceProvider(insuName,insuRegId,"false",extrafields, { from: App.account }); 
    //.alert("added successfully"); 
    await App.render();
  },
  addPatient:async()=>{    
    var patFName=$("#patFName").val();
    var patLName=$("#patLName").val();
    var patFullname=patFName+" "+patLName;
    var insuranceProviderSelect=$("#insuranceProviderSelect").val();
    var doctorSelect=$("#doctorSelect").val();
    //
    //window.alert(insuName +insuRegId );
    // Read Extra fileds
    var patDOB=$("#patDOB").val();
    var patgender = $("input[name='gender']:checked").val();
    var patPhone=$("#patPhone").val();
    var patEmail=$("#patEmail").val();
    var patInsuranceID=$("#patInsuranceID").val();
    var patAddress=$("#patAddress").val();
    var patCountry=$("#patCountry").val();
    var patState=$("#patState").val();
    var patCity=$("#patCity").val();
     var patPostalCode=$("#patPostalCode").val(); 

     var extrafields=patDOB+"?"+patgender+"?"+patPhone+"?"+patEmail+"?"+patInsuranceID+"?"+patAddress+"?"+patCountry+"?"+patState+"?"+patCity+"?"+patPostalCode;
     

    //Read Extar fileds ends
    await App.healthcare.registerPatient(patFullname,parseInt(insuranceProviderSelect),parseInt(doctorSelect),"false",extrafields, { from: App.account }); 
    //.alert("added successfully"); 
    await App.render();
  },
  proceesRegistration: async () => {
    var RoleSelect=$("#RoleSelect").val();
    var home = $("#home");
      var selectUserForRegistration = $("#selectUserForRegistration");
      var addhospital = $("#addhospital");
      var dashboardhealthprovider = $("#dashboardhealthprovider");
      var dashboarddoctor = $("#dashboarddoctor");
      var dashboardpatient = $("#dashboardpatient");
      var dashboardinsuranceprovider = $("#dashboardinsuranceprovider");
      var addDoctor = $("#addDoctor");
      var addInsurance = $("#addInsurance");
      var addPatient = $("#addPatient");
    if(RoleSelect=="1"){
      //add hospital page show      
        home.hide();
        selectUserForRegistration.hide();
        addhospital.show();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
    }
    if(RoleSelect=="2"){
      //add doctor page show
      //load available hospital list
      var hospitalSelect=$("#hospitalSelect");    
      hospitalSelect.empty();
      var count= await App.healthcare.hospitalCount();
      for (var i = 1; i <= count; i++) {
        console.log("Check select option"+i);
        var hospital=await App.healthcare.hospitals(i);
        var hospitalname=hospital[2];
        var hospitalid=hospital[0];
        var str = "<option value='" + hospitalid + "' >" + hospitalname + "</ option>";
        hospitalSelect.append(str);
      }
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.show();
        addInsurance.hide();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
    }
    if(RoleSelect=="3"){
      //add Patient page show
      //Load all Insurance Providers Registered
      var insuranceProviderSelect=$("#insuranceProviderSelect");    
      insuranceProviderSelect.empty();
      var count= await App.healthcare.insuranceCount();
      for (var i = 1; i <= count; i++) {
        //console.log("Check select option"+i);
        var insurance=await App.healthcare.insuranceproviders(i);
        var insurancename=insurance[2];
        var insuranceid=insurance[0];
        var str = "<option value='" + insuranceid + "' >" + insurancename + "</ option>";
        insuranceProviderSelect.append(str);
      }
    //Load all Doctors Registered
      var doctorSelect=$("#doctorSelect");    
      doctorSelect.empty();
      var count= await App.healthcare.doctorCount();
      for (var i = 1; i <= count; i++) {
        //console.log("Check select option"+i);
        var doctor=await App.healthcare.doctors(i);
        var doctorname=doctor[2];
        var doctorid=doctor[0];
        var str = "<option value='" + doctorid + "' >" + doctorname + "</ option>";
        doctorSelect.append(str);
      }

        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.hide();
        addPatient.show();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();        
    }
    if(RoleSelect=="4"){
      //add Insuarance Provider page show
       
        home.hide();
        selectUserForRegistration.hide();
        addhospital.hide();
        addDoctor.hide();
        addInsurance.show();
        addPatient.hide();
        dashboardhealthprovider.hide();
        dashboarddoctor.hide();
        dashboardpatient.hide();
        dashboardinsuranceprovider.hide();
    }
  }
}

// $(() => {
//   $(window).load(() => {
//     App.load()
//   })
// })

function loginRegisterClick(){
 
  App.load();
}
