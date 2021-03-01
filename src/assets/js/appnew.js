
App = {
  loading: false,
  contracts: {},
  manfdisplay:0,
  filedata:"",
  filehash:"",
  idofHospital:0,

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
            $("#hospitalNameprofile").html(hospitalName);
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
            App.idofHospital=i;
            break;
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
            $("#doctornameforprofile").html(doctorname);
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
        //Load all Doctors for file Sharing         
          var doctorSelectforShareFiles=$("#doctorSelectforShareFiles");    
          doctorSelectforShareFiles.empty();
          var count= await App.healthcare.doctorCount();
          for (var i = 1; i <= count; i++) {
            //console.log("Check select option"+i);
            var doctor=await App.healthcare.doctors(i);
            var doctorname=doctor[2];
            var doctorid=doctor[0];
            var str = "<option value='" + doctorid + "' >" + doctorname + "</ option>";
            doctorSelectforShareFiles.append(str);
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
            $("#insuranceprofilenam").html(insurancename);
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
  viewProfileofIns :async () =>{
    $("#insurancemainpage").show();
    $("#viewpatientsbyinsurance").hide();    
  },
  viewPatientsByIns :async () =>{
     //Retriee insurance provider ID
     $("#diaplaypatientdetailsbyinsu").empty();
     var insuCount=await App.healthcare.insuranceCount(); 
     var insuid=0;       
        for (var i = 1; i <= insuCount; i++) {
          var insu=await App.healthcare.insuranceproviders(i);         
          var insuaddress=insu.addr;
          if(insuaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
            insuid=i;           
              break;
          }
        }
    var patientCount=await App.healthcare.patientCount();
    for (var i = 1; i <= patientCount; i++) {
      var patient=await App.healthcare.patients(i); 
      console.log(patient)
      console.log(parseInt(patient[3]))
      console.log(insuid);
      if(parseInt(patient[3])==insuid) {
        var extrafields=patient.extrafields.split("?") ;          
        var str="<tr><td>"+patient.id+"</td><td>"+patient.name+"</td><td>"+extrafields[0]+"</td><td>"+extrafields[4]+"</td></tr>";
        $("#diaplaypatientdetailsbyinsu").append(str);
      }   
    }
    $("#insurancemainpage").hide();
    $("#viewpatientsbyinsurance").show();    
  },
  
  viewProfileofHospital :async () =>{
    $("#hospitalmain").show();
    $("#viewDoctorsbyHospital").hide();
    $("#viewPatientsbyHospital").hide();
    $("#viewAppointmentsbyHospital").hide();  
  },
  viewDoctorsofHospital :async () =>{
    //Load Doctors work on this hospital
    $("#disDoctorsByHospital").empty();
    var doctorcount=await App.healthcare.doctorCount();
    for (var i = 1; i <= doctorcount; i++) {
      var doctor=await App.healthcare.doctors(i);
      if(doctor.hospitalid==App.idofHospital){
        //this doctor works on this hospitals
        var str="<tr><td>"+doctor.id+"</td><td>"+doctor.name+"</td><td>"+doctor.regId+"</td></tr>";
        $("#disDoctorsByHospital").append(str);
        //window.alert("doctor="+doctor.name);
      }
    }
    $("#hospitalmain").hide();
    $("#viewDoctorsbyHospital").show();
    $("#viewPatientsbyHospital").hide();
    $("#viewAppointmentsbyHospital").hide();  
  },
  viewPatientsofHospital :async () =>{
    $("#dispatientsByHospital").empty();
    var patientCount=await App.healthcare.patientCount();
    for (var i = 1; i <= patientCount; i++) {
      var patient=await App.healthcare.patients(i);    
      var extrafields=patient.extrafields.split("?") ;
      var insuprovider=await App.healthcare.insuranceproviders(parseInt(patient.insuranceProviderid));      
        var str="<tr><td>"+patient.id+"</td><td>"+patient.name+"</td><td>"+extrafields[0]+"</td><td>"+insuprovider.name+"</td></tr>";
        $("#dispatientsByHospital").append(str);
        //window.alert("doctor="+doctor.name);     
    }

    $("#hospitalmain").hide();
    $("#viewDoctorsbyHospital").hide();
    $("#viewPatientsbyHospital").show();
    $("#viewAppointmentsbyHospital").hide();  
  },
  viewAppointmentsofHospital :async () =>{
    $("#disappointmentsByHospital").empty();
    var doctorcount=await App.healthcare.doctorCount();
    for (var i = 1; i <= doctorcount; i++) {
      var doctor=await App.healthcare.doctors(i);
      if(doctor.hospitalid==App.idofHospital){
        //this doctor works on this hospitals
        //Retrieve appointments of this doctor
        console.log("Doctor name="+doctor.name);
        var appointmentCount=await App.healthcare.appointmentCount();
        for (var j = 1; j <= appointmentCount; j++) {
          var appointment=await App.healthcare.appointments(j);
          // console.log("doctorid="+doctor.id);
          // console.log("Appointment doctor id="+appointment.doctorid);
          if(parseInt(appointment.doctorid)==parseInt(doctor.id)){
            // found appointmrnt of doctor
            //console.log("found");
            var str="<tr><td>"+appointment.id+"</td><td>"+doctor.name+"</td><td>"+appointment.date+"</td><td>"+appointment.patientid+"</td></tr>";
            $("#disappointmentsByHospital").append(str);
          }
        }  
      }
    }

    $("#hospitalmain").hide();
    $("#viewDoctorsbyHospital").hide();
    $("#viewPatientsbyHospital").hide();
    $("#viewAppointmentsbyHospital").show();  
  },

  ViewPatientsByDoctor :async () =>{
    $("#viewFilesbyDoctor").empty();
    //window.alert("checking");
       //Retriee Doctor ID
       var doctorCount=await App.healthcare.doctorCount(); 
       var doctorid=0;       
          for (var i = 1; i <= doctorCount; i++) {
            var doctor=await App.healthcare.doctors(i);         
            var doctoraddress=doctor.addr;
            if(doctoraddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
                doctorid=i;           
                break;
            }
          }
      //Retrieve all File sharing
      var fileSharingCount=await App.healthcare.fileSharingCount(); 
      var patientid=0;       
         for (var i = 1; i <= fileSharingCount; i++) {
           var filesharing=await App.healthcare.filesharings(i);         
           var idDoctor=filesharing.doctorid;
           if(doctorid==idDoctor){
             //File sharing found
             //Retrieve patient Details
             patientid=parseInt(filesharing.patientid);
             var patient= await App.healthcare.patients(patientid); 
             var link="https://ipfs.infura.io/ipfs/"+filesharing.filehash;
             var str=`<tr><td>${i}</td><td>${patient.name}</td><td>${patient.addr}</td><td><a href ='${link}'>${filesharing.filehash}</a></td></tr>`;
             console.log(str);
             $("#viewFilesbyDoctor").append(str);
           }
         }
    $("#doctormain").hide();
    $("#viewPatientsbydoctor").show();
    $("#viewAppointmentsbydoctorpage").hide();

  },
  ViewAppointmentsByDoctor :async ()=>{
    $("#viewApponitmentsbyDoctor").empty();
    //Retriee Doctor ID
       var doctorCount=await App.healthcare.doctorCount(); 
       var doctorid=0;       
          for (var i = 1; i <= doctorCount; i++) {
            var doctor=await App.healthcare.doctors(i);         
            var doctoraddress=doctor.addr;
            if(doctoraddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
                doctorid=i;           
                break;
            }
          }
          //Retrieve appointments
       var appointmentCount=await App.healthcare.appointmentCount();
       for (var i = 1; i <= appointmentCount; i++) {
        var appointment=await App.healthcare.appointments(i);         
        var d_id=appointment.doctorid;
        if(d_id==doctorid){
          console.log("appontment found");
          var p_id=appointment.patientid;
          var patient=await App.healthcare.patients(p_id); 
          var extrafields=patient.extrafields.split("?");          
          var str="<tr><td>"+appointment.id+"</td><td>"+patient.name+"</td><td>"+extrafields[0]+"</td><td>"+appointment.date+"</td><td>"+appointment.time;
          console.log(str);
          $("#viewApponitmentsbyDoctor").append(str);
        }
      }

    $("#doctormain").hide();
    $("#viewPatientsbydoctor").hide();
    $("#viewAppointmentsbydoctorpage").show();
  },
  viewProfileofDoctor :async () =>{
    $("#doctormain").show();
    $("#viewPatientsbydoctor").hide();
    $("#viewAppointmentsbydoctorpage").hide();
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
    $("#patientbookingView").hide();
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
    await App.healthcare.addAppointment(parseInt(patientid),parseInt(doctorid),appointmentdate,appointmenttime, { from: App.account }); 
    // $("#patientmain").show();
    // $("#patientbooking").hide();  
    // $("#patientbookingView").hide();
    await App.ViewAppointmentByPatient();
  },
  ViewAppointmentByPatient :async()=>{
    $("#viewAppointmentsByPatient").empty();
    //Retriee Patient ID
    var patientCount=await App.healthcare.patientCount(); 
    var patientid=0; 
    var patientname="";  
    var age="";   
    for (var i = 1; i <= patientCount; i++) {
      var patient=await App.healthcare.patients(i);         
      var patientaddress=patient.addr;
      if(patientaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
        patientid=i;
        patientname=patient.name;        
        var extrafields=patient.extrafields.split("?");
        age=extrafields[0];
        break;
      }
    }
     //Retriee all appointments of this Patient ID
     var appointmentCount=await App.healthcare.appointmentCount();         
     for (var i = 1; i <= appointmentCount; i++) {
       var appointment=await App.healthcare.appointments(i);
       if(appointment.patientid==patientid){
          //Retrieve Doctor Name
          var doctor=await App.healthcare.doctors(appointment.doctorid);
          var extrafields=doctor.extrafields.split("?");
          var str="<tr><td>"+i+"</td><td>" +patientname+"</td><td>"+age+"</td><td>"+doctor.name+"</td><td>"+extrafields[4]+"</td><td>"+appointment.date+"</td><td>"+appointment.time+"</td><tr>";
          $("#viewAppointmentsByPatient").append(str);
       }
     }
    $("#patientmain").hide();
    $("#patientbooking").hide();  
    $("#patientbookingView").show();
  },
  shareFileToDoctor :async ()=>{
    var doctorId=$("#doctorSelectforShareFiles").val();   
    var patientCount=await App.healthcare.patientCount(); 
    var patientid=0; 
    var filehash=""     
    for (var i = 1; i <= patientCount; i++) {
      var patient=await App.healthcare.patients(i);         
      var patientaddress=patient.addr;
      if(patientaddress.toUpperCase().localeCompare(App.account.toUpperCase())==0){
        patientid=i;
        filehash=patient.filehashes;
        break;
      }
    }     
    await App.healthcare.addFileSharing(parseInt(patientid),parseInt(doctorId),filehash, { from: App.account }); 
    // $("#patientmain").show();
    // $("#patientbooking").hide();  
    // $("#patientbookingView").hide();
    await App.render();
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
    //Add file to Blockchain
     const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
     var filehash="";
     //window.alert(App.filedata);
     ipfs.add(App.filedata,(err,hash)=>{
       if(err){
         console.log(err); 
         filehash="";
         App.filehash="";
         window.alert("Eror in file upload to blockchain"+err) ;     
       }
       else{
         console.log("https://ipfs.infura.io/ipfs/"+hash);
         filehash=hash;  
         App.filehash=hash;
         var extrafields=patDOB+"?"+patgender+"?"+patPhone+"?"+patEmail+"?"+patInsuranceID+"?"+patAddress+"?"+patCountry+"?"+patState+"?"+patCity+"?"+patPostalCode;
          //window.alert("hash value file="+filehash);
          //Read Extar fileds end
          App.healthcare.registerPatient(patFullname,parseInt(insuranceProviderSelect),parseInt(doctorSelect),"false",extrafields,filehash, { from: App.account }).then(()=>{
            window.alert("Registered Successfully");
            App.render();
          }); 
        //   //.alert("added successfully"); 
              
       }
     });          
    //Add file to Blockchain Ends
  },
  fileUploadBypatient: async ()=>{
    //Add files
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }   
  
    var input = document.getElementById('myFile');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
      App.filedata="";               
    }
    else {           
      document.getElementById('myFile') 
      .addEventListener('change', function() {                       
      var fr=new FileReader(); 
      fr.onload=function(){ 
          //  document.getElementById('output') 
          //          .textContent=fr.result; 
          //window.alert(fr.result);
          App.filedata=fr.result;
      }                       
      fr.readAsText(this.files[0]); 
      }) 
    }
   //File reading Ends   
   if(App.filedata!==""){
     window.alert("successfully Uploaded");
   }
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
         
      
      //file event listener adding
      document.getElementById('myFile') 
          .addEventListener('change', function() {                       
          var fr=new FileReader(); 
          fr.onload=function(){ 
              //  document.getElementById('output') 
              //          .textContent=fr.result; 
              //window.alert(fr.result);
              App.filedata=fr.result;
          }                       
          fr.readAsText(this.files[0]); 
          }) ;
      //file event listener adding

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
  },
  
  loginRegisterClick : async () =>{   
    App.load();
  }
}

// $(() => {
//   $(window).load(() => {
//     App.load()
//   })
// })

// function loginRegisterClick1() { 
//   App.load();
// }
