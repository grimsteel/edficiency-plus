var sessions = {};
var filteredSessions = {};
var flatSessions = [];
var flatRequests = [];
var serverData = {};
var maxDate = '';
var maxModified = '';
var firstTime = true;
var periodList = {};
var newFlatSessions = {};
var sessionDict = {};
var sessionsizes = {};
var roster= [];


$(document).ready(function(){
  //updateStatusRow();
  loadSessionsAndRequests(); 
  $(window).resize(function(){
    resizeCards();
  })
});

function updateStatusRow(){
  let lastUpdated = localStorage['upcomingSessionsMaxDate'] || '';
  let lastModified = localStorage['upcomingSessionsMaxModified'] || '';
  let clientSessionHash = localStorage['clientSessionHash'] || '';
  let clientRefreshTime = localStorage['sessionsRefreshTime'] || '';
  $("#statusRow").html(
    "clientRefreshTime: "+clientRefreshTime+"<br>"+
    "clientSessionHash: "+clientSessionHash+"<br>"+
    "lastModified: "+lastModified+"<br>"+
    "lastUpdated: "+lastUpdated+"<br>"
  );
}

function loadSessionsAndRequests(){
  let lastUpdated = localStorage['upcomingSessionsMaxDate'] || '';
  let lastModified = localStorage['upcomingSessionsMaxModified'] || '';
  let clientSessionHash = localStorage['clientSessionHash'] || '';
  let clientRefreshTime = localStorage['sessionsRefreshTime'] || '';

  //Assemble a useful periodList for later
  for(let i = 0; i<periodkeys.length; i++){
    periodList[periodkeys[i]] = {
      order: i,
      name: periodnames[i]
    };
  }

  console.log(lastUpdated);
  console.log(lastModified);
  console.log(clientSessionHash);

  let datastr = "maxDate="+lastUpdated+
    '\u0026lastModified='+lastModified+
    '\u0026clientSessionHash='+clientSessionHash;

  if(localStorage['sessionsizes'] !== undefined){
    datastr = datastr + '\u0026lastRefresh='+clientRefreshTime;
  }

  $.post(ajax+"getAvailableSessions.php",datastr,function(result){
    serverData = JSON.parse(result);
    console.log(serverData);

    //Verify session data. Render sessions if valid. Request all sessions if invalid
    verifyData().then(function(hash){
      localStorage['clientSessionHash'] = hash;
      if(hash == serverData.sessionhash){
        console.log('Data verified...');
        renderSessionsAndRequests();
      }else{
        console.log('Reloading Everything: ');
        $.post(ajax+"getAvailableSessions.php","",function(result){
          serverData = JSON.parse(result);
          //console.log(JSON.stringify(serverData.sessions));
          verifyData().then(function(hash){
            localStorage['clientSessionHash'] = hash;
            renderSessionsAndRequests();
          });
      
        });
      }
    });

  });


} //end LoadSessionsAndRequests Function

function renderSessionsAndRequests(){
  createRequestList();
  createSessionList();
  
  $(".session-filter").on("input",function(){
    updateSessionList($(this));
  });
  $(".session").on("click",function(){
    clickSession($(this));
  });
  resizeCards();

  //Open Request and scroll to request and date if passed a session to request
  if( getSessionId > 0 ){
    $(".session").each(function(){
      if($(this).attr("id") == getSessionId){
        let $scrollDiv = $(this).parent().parent();
        //$scrollDiv.removeClass("scroll-snap-container");
        $(this).trigger("click");
        $scrollDiv.scrollTop($scrollDiv.scrollTop()+$(this).position().top-63);
        $(this).addClass("shake");

        let requestDate = $(this).attr("date");
        $(".request-date").each(function(){
          if($(this).attr("id")=="request"+requestDate){
            let $scrollDiv2 = $(this).parent().parent();
            $scrollDiv2.scrollTop($scrollDiv2.scrollTop()+$(this).position().top-63);
          }
        })
      }
    });
    getSessionId=0;
  }else{
    console.log("Scroll to top?");
    let $scrollDiv = $("#sessionContainer").parent();
    $scrollDiv.scrollTop(0);
    let $scrollDiv2 = $("#requestContainer").parent();
    $scrollDiv2.scrollTop(0);
  }
}

function verifyData(){
  if(serverData.refreshTime !== undefined){
    localStorage['sessionsRefreshTime'] = serverData.refreshTime;
    localStorage['roster'] = JSON.stringify(serverData.roster);
    localStorage['sessionsizes'] = JSON.stringify(serverData.sessionsizes);
  }
  let storedSessions = localStorage['upcomingSessions'];
  roster = JSON.parse(localStorage['roster']);
  sessionsizes = JSON.parse(localStorage['sessionsizes']);
  //console.log(storedSessions);
  if(storedSessions !== undefined){
    try{
      //console.log("I'm trying to parse");
      storedSessions = JSON.parse(storedSessions);
    }catch(e){
      localStorage.removeItem('upcomingSessions');
      storedSessions = {};
    }
  }else{
    //console.log("tying new");
    storedSessions = {};
  }

  //Update session data from server data
  let serverSessions = serverData.sessions
  for(const ses in serverData.sessions){
    storedSessions[ses] = serverSessions[ses];
  };

  //Delete saved sessions if they don't appear in the new sessionsizes object
  for(const ses in storedSessions){
    if(!sessionsizes.hasOwnProperty(ses)){
      delete storedSessions[ses];
    }
  }

  localStorage['upcomingSessions'] = JSON.stringify(storedSessions);
  localStorage.removeItem('upcomingSessionsMaxDate');
  localStorage.removeItem('upcomingSessionsMaxModified');

  //Load sessions into flatSessions array, getting maxDate and maxModified at the same time
  flatSessions = [];
  maxDate = '';
  maxModified = ''
  for(ses in storedSessions){
    if(storedSessions[ses][0].date > maxDate){
      maxDate = storedSessions[ses][0].date;
    }
    if(storedSessions[ses][0].modifiedtime > maxModified){
      maxModified = storedSessions[ses][0].modifiedtime;
    }
    flatSessions.push(storedSessions[ses][0]);
    sessionDict[ses] = storedSessions[ses][0];
  }

  localStorage['upcomingSessionsMaxModified'] = maxModified;
  localStorage['upcomingSessionsMaxDate'] = maxDate;
  flatSessions.sort(sessionSort);
  //console.log(sessionDict);

  //Check hash...
  let hashString = JSON.stringify(flatSessions);
  //console.log("This is what I'm tracking",hashString);
  return hashAsync(hashString); //.then(output => console.log(output));
}

function commentPopup(note){
  $.alert({
    title:"Request Comment",
    content: note
  })
}

function createRequestList(){
  //flatSessions = [];
  flatRequests = [];
  $("#requestContainer").empty(); 

  //create list of dates the student participates in
  let rosterDates = {};
  roster.forEach(function(rosterEntry){
    rosterDates[rosterEntry.date] = 1;
  });

  //Loop through all dates, creating request cards for each date.
  for(rosterDate in rosterDates){
    //console.log(rosterDate);
    $("#requestContainer").append(''+
      '<li class="scroll-snap-element bg-white shadow p-2 border border-dark rounded my-1 request-date" id="request'+rosterDate+'">'+
      '<div class="bg-secondary text-white p-2 rounded">'+getNiceDate(rosterDate)+'</div></li>');
    
    //Create period entries for each date
    roster.forEach(function(rosterEntry){
      if(rosterEntry.date == rosterDate){
        let pdid = ('p'+rosterEntry.date+'-'+rosterEntry.period_id).split('-').join('');
        let appStr = '<div id="'+pdid+'" class="period-list d-flex my-auto p-1 h-100">';
        //console.log(rosterEntry.period_id);
        let periodName = periodList[rosterEntry.period_id].name;

        if(multiplePeriods){
          appStr = appStr + '<div class="bg-light border border-dark my-auto rounded p-2 text-nowrap" style="max-width:40%;" data-toggle="tooltip" title="'+periodName+'">'+periodName+(rosterEntry.status == 'O'?' <small>(Opt In)</small>':'') +'</div>'; 
        }
        let periodRequest = serverData.requests.filter(request => sessionDict[request.sessionid].date == rosterEntry.date && sessionDict[request.sessionid].period_id == rosterEntry.period_id);
        let confirmedPeriod = serverData.confirmedPeriods.filter(period => period.date == rosterEntry.date && period.period_id== rosterEntry.period_id);

        if(confirmedPeriod.length == 1){
          appStr = appStr + '<div class="input-group border border-secondary rounded ml-1">'+
          '<div class="input-group-prepend">'+
            '<span class="input-group-text"><i class="fa fa-lock"></i></span>'+
          '</div>'+
          '<div class="my-auto mx-1 background-secondary">Request Window Closed</div>'+
        '</div>';
        }else if(periodRequest.length == 0){
          appStr = appStr + '<div class="input-group border border-secondary rounded ml-1">'+
            '<div class="input-group-prepend" style="cursor:pointer;" onclick="filterToPeriod(\''+rosterEntry.date+'\',\''+rosterEntry.period_id+'\')">'+
              '<span class="input-group-text"><i class="fa fa-search"></i></span>'+
            '</div>'+
            '<input type="text" class="form-control session-filter" placeholder="Search these sessions" date="'+rosterEntry.date+'" period="'+rosterEntry.period_id+'">'+
          '</div>';
        }else{
          let req = periodRequest[0];
          let reqses = sessionDict[req.sessionid];
          let tooltip = "";
          let onTheOuts = false;
          //check if session is full and student is excluded
          let typeseats = reqses.openseats;
          let typereqnum = 0;
          if(rosterEntry.blendedMode == 'V'){
            typeseats = parseInt(reqses.vseats);
            typereqnum = parseInt(sessionsizes[reqses.id].vreqnum);
          }else{
            typeseats = parseInt(reqses.iseats);
            typereqnum = parseInt(sessionsizes[reqses.id].ireqnum);
          }


          if(req.pendingconfirm == 0 && (typeseats <= typereqnum || reqses.openseats <= sessionsizes[reqses.id].reqnum)){
            tooltip = "YOU ARE ON THE WAITLIST FOR THIS SESSION<br><em>(You may want to request a different session)</em>";
            onTheOuts = true;
          }else{
            tooltip = reqses.tname + "<br>" + reqses.location 
              + "<br><em>"+reqses.name+"</em><br>" 
              + ((req.priority == 2)?"Low Priority":"High Priority")
              +((req.frontrow==1)?"<br><em>Help Requested</em>":"");
          }

          appStr = appStr + '<div class="input-group border border-secondary rounded ml-1 shadow-sm">'+
            '<div class="input-group-prepend" onclick="deleteRequest('+req.id+')">'+
              '<span class="input-group-text"><i class="fa fa-minus-circle text-danger" style="cursor:pointer;" title="Delete Request"></i></span>'+
            '</div>'+
            '<div class="form-control '+(onTheOuts?'bg-warning':'')+'" data-toggle="tooltip" data-html="true" title="'+tooltip+'" style="overflow-y:hidden;cursor:default;">'+
            '<span class="badge badge-primary">'+((req.priority==2)?'L':'H')+'</span>&nbsp'+
            ((req.frontrow == 1)?'<i class="fa fa-hand-paper-o"></i>&nbsp':'')+
            ((req.note !== "")?'<i class="fa fa-commenting" style="cursor:pointer;" onclick="commentPopup(\''+req.note+'\')"></i>&nbsp':'')+
            reqses.tname+' ('+reqses.location+')&nbsp<em> '+ reqses.name + ' (' + (req.pendingconfirm ? 'Approved' : 'Not Yet Approved') + ')</em></div>'+
          '</div>';
          flatRequests.push(req);
        }
        appStr = appStr+"</div>"

        $("#request"+rosterEntry.date).append(appStr);
      }
      $('[data-toggle="tooltip"]').tooltip();
      
    }); //End roster entry loop
  }

  //forEach date
  //console.log(sessions);
  // sessions.forEach(function(date){
  //   //append a div with a date header
  //   $("#requestContainer").append(''+
  //     '<li class="scroll-snap-element bg-white shadow p-2 border border-dark rounded my-1 request-date" id="request'+date[0].sessions[0].date+'">'+
  //     '<div class="bg-secondary text-white p-2 rounded">'+date[0].sessions[0].niceDate+'</div></li>');
  //   date.forEach(function(period){
  //     let appStr = '<div class="d-flex my-auto p-1 h-100">';
  //     if(multiplePeriods){
  //       appStr = appStr + '<div class="bg-light border border-dark my-auto rounded p-2 text-nowrap" style="max-width:40%;" data-toggle="tooltip" title="'+period.sessions[0].pname+'">'+period.sessions[0].pname+(period.sessions[0].status == 'O'?' <small>(Opt In)</small>':'') +'</div>'; 
  //     }
  //     if(!("request" in period)){
  //       appStr = appStr + '<div class="input-group border border-secondary rounded ml-1">'+
  //         '<div class="input-group-prepend" style="cursor:pointer;" onclick="filterToPeriod(\''+period.sessions[0].date+'\',\''+period.sessions[0].period_id+'\')">'+
  //           '<span class="input-group-text"><i class="fa fa-search"></i></span>'+
  //         '</div>'+
  //         '<input type="text" class="form-control session-filter" placeholder="Search these sessions" date="'+period.sessions[0].date+'" period="'+period.sessions[0].period_id+'">'+
  //       '</div>';
  //     }else{
  //       tooltip = period.request.tname + "<br>" + period.request.location + "<br><em>"+period.request.name+"</em><br>" + ((period.request.priority == 2)?"Low Priority":"High Priority")+((period.request.frontrow==1)?"<br><em>Help Requested</em>":"");
  //       appStr = appStr + '<div class="input-group border border-secondary rounded ml-1 shadow-sm ">'+
  //         '<div class="input-group-prepend" onclick="deleteRequest('+period.request.id+')">'+
  //           '<span class="input-group-text"><i class="fa fa-minus-circle text-danger" style="cursor:pointer;" title="Delete Request"></i></span>'+
  //         '</div>'+
  //         '<div class="form-control" data-toggle="tooltip" data-html="true" title="'+tooltip+'" style="overflow-y:hidden;cursor:default;">'+
  //         '<span class="badge badge-primary">'+((period.request.priority==2)?'L':'H')+'</span>&nbsp'+
  //         ((period.request.frontrow == 1)?'<i class="fa fa-hand-paper-o"></i>&nbsp':'')+
  //         ((period.request.note !== "")?'<i class="fa fa-commenting" style="cursor:pointer;" onclick="commentPopup(\''+period.request.note+'\')"></i>&nbsp':'')+
  //         period.request.tname+' ('+period.request.location+')&nbsp<em> '+ period.request.name +'</em></div>'+
  //       '</div>';
  //       flatRequests.push(period.request);
  //     }

  //     appStr = appStr+"</div>"

  //     $("#request"+period.sessions[0].date).append(appStr);

  //     period.sessions.forEach(function(session){
  //       flatSessions.push(session);
  //     });

  //   });

  //   $('[data-toggle="tooltip"]').tooltip();
  // });
}



function createSessionList(){
  //Dict for tracking periods that have sessions
  let periodsWithSessions = {};


  $("#sessionContainer").empty();
  flatSessions.forEach(function(session){

    let periodMode = 'I';
    let rosterEntry;
    session.niceDate = getNiceDate(session.date);
    session.pname = periodList[session.period_id].name;
    roster.filter(x=> x.date == session.date && x.period_id == session.period_id).forEach(function(re){
      rosterEntry = re;
    });

    //check to see if this is a valid period for the student
    if(rosterEntry === undefined || rosterEntry.status == 'E'){
      return;
    }

    //check to see if session is limited to a group the student isn't a participant in
    if(session.groupid !== null){
      let a = new Set(memberGroups.map(x => parseInt(x)));
      let b = new Set(JSON.parse(session.groupid).map(x => parseInt(x)));
      let c = new Set([...a, ...b]);


      if(session.sessionid == '26228'){console.log(a,b,c);}

      if(Array.from(a).length + Array.from(b).length == Array.from(c).length){
        return;
      }
      
      // if(memberGroups.indexOf(session.groupid) < 0){
      //   return;
      // }
    }

    //IGNORE SESSIONS THAT ARE FOR PERIODS THAT HAVE ALREADY BEEN CONFIRMED
    let confirmedPeriod = false;
    serverData.confirmedPeriods.forEach(function(period){
      if(period.date == session.date && period.period_id == session.period_id){
        confirmedPeriod = true;
      }
    });

    if(confirmedPeriod){
      return;
    }

    //Ignore sessions that aren't requestable
    if(session.requestable == 0){ 
      return;
    }
    //COME BACK TO DO THIS!

    

    let $li = $('<div id="'+session.id+'" date="'+session.date+'" period_id="'+session.period_id+'" detail="'+session.detail+'" class="session py-1 bg-light border border-secondary rounded shadow mb-2 scroll-snap-element"></div>');
    let $teacherRow = $('<div class="row px-2 d-flex justify-content-between" style="margin:auto;"></div>');
    $teacherRow.append('<div class="font-weight-bold">'+session.tname+'</div>');
    $teacherRow.append('<div><em>'+session.location+'</em></div>');
    let $dateRow = $('<div class="row px-2 d-flex justify-content-between small" style="margin:auto;"></div>');
    $dateRow.append('<div>'+session.niceDate+'</div>');
    if(multiplePeriods){
      $dateRow.append('<div>'+session.pname+'</div>');
    }
    let $sessionRow = $('<div class="row px-2 d-flex justify-content-between" style="margin:auto;"></div>');
    $sessionRow.append('<div>'+session.name+'</div>');

    //check for available seats
    let hinum = sessionsizes[session.id].hinum;
    let reqnum = parseInt(sessionsizes[session.id].reqnum);
    let openseats = parseInt(sessionDict[session.id].openseats);
    let typeseats = parseInt(openseats);
    let typereqnum = 0;
    let typehinum = 0;
    if(rosterEntry.blendedMode == 'V'){
      typeseats = parseInt(session.vseats);
      typereqnum = parseInt(sessionsizes[session.id].vreqnum);
      typehinum = parseInt(sessionsizes[session.id].vhinum);
    }else{
      typeseats = parseInt(session.iseats);
      typereqnum = parseInt(sessionsizes[session.id].ireqnum);
      typehinum = parseInt(sessionsizes[session.id].ihinum);
    }
    
    const percentApproved = Math.round(100 * hinum / openseats);
    const percentRequested = Math.round(100 * reqnum / openseats);
    let text = "Open Seats";
    let color = "success";

    if( hinum>= openseats || typehinum >= typeseats ){
      text = "Wait List";
      color = "danger";
    }else if( reqnum + 5 > openseats || typereqnum + 5 > typeseats){
      text = "Filling Up";
      color = "warning";
    }
    $sessionRow.append(`<div><span title="${hinum} approved, ${reqnum} requested, ${openseats} seats" class="ml-1 badge badge-${color}">${text} (${percentApproved}% / ${percentRequested}%)</span></div>`);
    $li.append($dateRow);
    $li.append($teacherRow);
    $li.append($sessionRow);
    $("#sessionContainer").append($li);
    
    //Log this as a period with session
    periodsWithSessions[('p'+session.date+session.period_id).split('-').join('')] = 1;

  });

  //Hide periods without sessions
  let periods = [...document.getElementsByClassName('period-list')];
  periods.forEach(function(period){
    if(!periodsWithSessions.hasOwnProperty(period.id)){
      period.remove();
    }
  });
  //console.log(periodsWithSessions);
}

function clickSession(session){
  $(".session").unbind();
  $(".session").on("click",function(){
    clickSession($(this));
  });
  //Remove existing sessionReqest stuff from anywhere it is.
  $(".sessionRequestOptions").remove();
  session.unbind();

  //Create Options Element
  let $opts = $('<div class="sessionRequestOptions"></div>')
  let $detailRow = $('<div class="row px-2 d-flex justify-content-between mb-1" style="margin:auto;"><span>Details: <em>'+session.attr('detail')+'</em></span></div>');
  let $noteRow = $('<div class="row px-2 d-flex justify-content-between mb-1" style="margin:auto;"></div>');
  let $rqstRow = $('<div class="row px-2 d-flex justify-content-between mt-2" style="margin:auto;"></div>');
  let $help = $('<div id="helpNeeded" value="0" class="d-flex border border-secondary rounded px-1" onclick="toggleHelp()"><div class="my-auto">Help Needed:&nbsp</div><i id="helpIcon" class="fa fa-square-o bg-white" style="margin:auto;"></i></div>');
  let $btnDiv = $("<div></div>")
  let $low = $('<button id="lowButton" class="btn btn-sm btn-outline-primary mr-1" onclick="requestSession('+session.attr('id')+',\''+session.attr('date')+'\','+session.attr('period_id')+',0)">Request Low</button>');
  let $high = $('<button id="highButton" class="btn btn-sm btn-outline-primary ml-1" title="High priority requests require a note" onclick="requestSession('+session.attr('id')+',\''+session.attr('date')+'\','+session.attr('period_id')+',1)">Request High</button>');
  let $note = $('<div class="input-group input-group-sm mb-1 mt-2 w-100"><div class="input-group-prepend"><span class="input-group-text">Note:</span></div><input type="text" class="form-control" id="requestNote"></div>');

  $noteRow.append($note);
  $rqstRow.append($help);
  $btnDiv.append($low);
  $btnDiv.append($high);
  $rqstRow.append($btnDiv);
  
  if(session.attr('detail') !== undefined && session.attr('detail').length > 0){$opts.append($detailRow)};
  $opts.append($rqstRow);
  $opts.append($noteRow);

  session.append($opts);

}

function toggleHelp(){
  if($("#helpNeeded").val() == 0){
    $("#helpNeeded").val(1);
    $("#helpIcon").removeClass("fa-square-o");
    $("#helpIcon").addClass("fa-hand-paper-o");
    $("#helpNeeded").addClass("font-weight-bold");
  }else{
    $("#helpNeeded").val(0);
    $("#helpIcon").removeClass("fa-hand-paper-o");
    $("#helpIcon").addClass("fa-square-o");
    $("#helpNeeded").removeClass("font-weight-bold");
  }
}

function updateSessionList(searchBox = ''){
  let searchString = "";
  if(searchBox == ''){
    $(".session").removeClass('d-none');
  }else{
    searchString = searchBox.val();
    $(".session-filter").val("");
    searchBox.val(searchString);
    flatSessions.forEach(function(session){
      //check for words
      wordInSession = [];
      words = searchString.split(" ");
      words.forEach(function(word){
        if(session.tname.toLowerCase().indexOf(word.toLowerCase())>=0
            || session.location.toLowerCase().indexOf(word.toLowerCase())>=0
            || session.name.toLowerCase().indexOf(word.toLowerCase())>=0
            || session.niceDate.toLowerCase().indexOf(word.toLowerCase())>=0
            || session.detail.toLowerCase().indexOf(word.toLowerCase())>=0
            || (session.pname.toLowerCase().indexOf(word.toLowerCase())>=0 && multiplePeriods)){
          wordInSession.push(true);
        }else{
          wordInSession.push(false);
        }
      });
      let hasAllWords = wordInSession.every(function(word){return word;});

      //check for proper date if needed
      let properDate = true;
      if(typeof(searchBox.attr("date")) !== 'undefined'){
        if(searchBox.attr("date")==session.date){
          if(searchBox.attr("period")==session.period_id){
            properDate = true;
          }else{
            properDate = false;
          }
        }else{
          properDate = false;
        }
      }

      if((properDate && hasAllWords) || searchString == "" ){
        $("#"+session.sessionid).removeClass("d-none");
      }else{
        $("#"+session.sessionid).addClass("d-none");
      };
    });
  }
}

function resizeCards(){

  let currentlyRequesting = false;

  if($(".sessionRequestOptions").length > 0){
    currentlyRequesting = true;
  }else{
    //find current biggest session card
    clickSession($(".session").first());

  }
  
  let vh = window.innerHeight;
  let vw = window.innerWidth;
  let maxDateHeight = 0;
  let maxSessionHeight = 0;
  let requestBodyHeight = 0;
  let sessionBodyHeight = 0;
  let requestOptionsHeight = $(".sessionRequestOptions").first().outerHeight();

  if(!currentlyRequesting){
    $(".sessionRequestOptions").remove();
    $(".session").first().on("click",function(){
      clickSession($(this));
    });
  }

  $('.request-date').each(function(){
    if ($(this).height() > maxDateHeight) {
        maxDateHeight = $(this).outerHeight();
    }
  });

  $('.session').each(function(){
    if ($(this).height() > maxSessionHeight) {
      maxSessionHeight = $(this).outerHeight();
    }
  });

  requestBodyHeight = $("#requestHeader").outerHeight()+25+maxDateHeight;
  sessionBodyHeight = $("#sessionHeader").outerHeight()+25+maxSessionHeight+requestOptionsHeight;

  if(vw > 768){
    if(vh-$("#requestHeader").offset().top-10>requestBodyHeight){
      requestBodyHeight = vh-$("#requestHeader").offset().top-25;
    }

  }

  $("#requestCard").css("max-height",(requestBodyHeight+"px"));

  if(vh-$("#sessionHeader").offset().top-10>sessionBodyHeight){
    sessionBodyHeight = vh-$("#sessionHeader").offset().top-25;
  }
  
  $("#sessionCard").css("max-height",(sessionBodyHeight+"px"));

}

function requestSession(sessionid,date,period_id,priority = 0){
  if(priority == 1 || $("#helpNeeded").val() == 1){
    if($("#requestNote").val().length < 3){
      $.alert("You must add a note when requesting HELP NEEDED or HIGH PRIORITY");
      return;
    }
  }

  let hasExistingRequest = false;
  let requestDetails = "";
  flatRequests.forEach(function(request){
    if(sessionDict[request.sessionid].date == date && sessionDict[request.sessionid].period_id == period_id){
      hasExistingRequest = true;
      requestDetails = getRequestDetailCard(request.id);
    }
  });

  if(hasExistingRequest){
    $.confirm({
      title:"Replace Exisiting Request?",
      content: "Submitting this request will delete the existing request for:<br>"+requestDetails,
      columnClass: "col-11 col-sm-10 col-md-8 col-lg-6",
      buttons:{
        confirm:{
          text:"Add New Request",
          btnClass:"btn btn-primary",
          action: function(){
            processRequest(sessionid,date,priority,period_id);
          }
        },
        cancel:{
          text:"Keep Old Request",
          btnClass:"btn btn-secondary",
          action: function(){
            //cancel request
          }
        }
      }
    });
  }else{
    processRequest(sessionid,date,priority,period_id);
  }
}

function getRequestDetailCard(requestid){
  let requestDetails = "";
  serverData.requests.forEach(function(request){
    let reqses = sessionDict[request.sessionid];
    if(requestid == request.id){
      requestDetails = requestDetails + '<div class="border border-secondary rounded p-2">';
      requestDetails = requestDetails + "<div><h5><span class='badge badge-secondary p-2'>"+getNiceDate(reqses.date)+((multiplePeriods)?", "+periodList[reqses.period_id].name:"")+"</span></h5></div>";
      requestDetails = requestDetails + "<div class='mx-4'><strong>"+reqses.tname+"</strong> ("+reqses.location+")<br>"+
        reqses.name+"<br><em>"+((request.priority==5)?"High Priority":"Low Priority")+
        ((request.frontrow == 1)?", Help Needed":"")+"</em>"+
        ((request.note !== "")?"<br><small><em>Note: "+request.note+"</em></small>":"");
      requestDetails = requestDetails + "</div></div>";
    }
  });
  return requestDetails;
}



function processRequest(sessionid,date,priority,period_id){
  let datastr = "date="+date+
      "\u0026sesid="+sessionid+
      "\u0026pid="+period_id+
      "\u0026priority="+priority+
      "\u0026frontrow="+$("#helpNeeded").val()+
      "\u0026note="+$("#requestNote").val();
  $.post(ajax+"addStudentSessionRequest.php",datastr, function(result){
    if(result == "Not Logged In"){
      location.href = urlroot+"/logout.php";
    }else if(result != ""){
      $.alert(result);
      loadSessionsAndRequests();
    }else{
      $.alert("Request Submitted");
      loadSessionsAndRequests();
    }
  });

}

function deleteRequest(requestid){
  let requestDetails = getRequestDetailCard(requestid);
  let request = {};
  flatRequests.forEach(function(rqst){
    if(rqst.id == requestid){
      request = rqst;
    }
  });
  $.confirm({
    title:"Delete Request?",
    content: "Submitting this request will delete the existing request for:<br><br>"+requestDetails,
    columnClass: "col-11 col-sm-10 col-md-8 col-lg-6",
    buttons:{
      confirm:{
        text:"Delete Request",
        btnClass:"btn btn-danger",
        action: function(){
          let datastr = "date="+sessionDict[request.sessionid].date+
              "\u0026pid="+sessionDict[request.sessionid].period_id;
          $.post(ajax+"deleteStudentEnrollmentRequest.php",datastr, function(result){
            if(result != ""){
              $.alert(result);
              loadSessionsAndRequests();
            }else{
              //$.alert("Request Deleted");
              loadSessionsAndRequests();
            }
          });
        }
      },
      cancel:{
        text:"Keep Request",
        btnClass:"btn btn-secondary",
        action: function(){
          //cancel request
        }
      }
    }
  });
}

function filterToPeriod( date = "", period = "" ){
  $(".session-filter").val("");
  flatSessions.forEach(function(session){
    if((session.date == date && session.period_id == period) || date == "" || period == ""){
      $("#"+session.sessionid).removeClass("d-none");
    }else{
      $("#"+session.sessionid).addClass("d-none");
    };
  });
}


function sessionSort(a,b){
  if(a.date < b.date){
    return -1;
  }
  
  if(a.date > b.date){
    return 1;
  }
  
  if(parseInt(a.porder) < parseInt(b.porder)){
    return -1;
  }

  if(parseInt(a.porder) > parseInt(b.porder)){
    return 1;
  }

  if(a.tname < b.tname){
    return -1;
  }
  if(a.tname > b.tname){
    return 1;
  }

  if(parseInt(a.id) < parseInt(b.id)){
    return -1;
  }

  if(parseInt(a.id) > parseInt(b.id)){
    return 1;
  }

  return 0;

}
