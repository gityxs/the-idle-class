const DISPLAY_LOOP_INTERVAL = 100;
const CHECK_LOOP_INTERVAL = 2500;
const LONG_INTERVAL = 60000;
const CPS_BASE_INTERVAL = 1000; 
var myPieChart, myLineGraph, myInvestmentChart, myEmailChart, myClickChart, myBankruptcyChart;
var sessionStarted = Date.now()
var investType = null;

$(function() {
    initializeGame();
    startGame();
    ko.options.deferUpdates = true;
    ko.applyBindings(game);
});

ko.bindingHandlers.fadeVisible = {
  init: function(element, valueAccessor) {
      // Initially set the element to be instantly visible/hidden depending on the value
      var value = valueAccessor();
      $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function(element, valueAccessor) {
      // Whenever the value subsequently changes, slowly fade the element in or out
      var value = valueAccessor();
      ko.unwrap(value) ? /*setTimeout(function() {$(element).fadeIn()}, 500)*/ $(element).fadeIn(1000) : $(element).hide();
  }
};

ko.bindingHandlers.quickFadeVisible = {
  init: function(element, valueAccessor) {
      // Initially set the element to be instantly visible/hidden depending on the value
      var value = valueAccessor();
      $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function(element, valueAccessor) {
      // Whenever the value subsequently changes, slowly fade the element in or out
      var value = valueAccessor();
      ko.unwrap(value) ? /*setTimeout(function() {$(element).fadeIn()}, 500)*/ $(element).finish().show() : $(element).finish().fadeOut(150);
  }
};

ko.bindingHandlers.fadeHtml = {
  update: function(element, valueAccessor, allBindings) {
    var text = ko.unwrap(valueAccessor());
    $(element).fadeOut('fast', function() {
      $(element).html(text);
      $(element).fadeIn('fast');
    });
  }
};

ko.bindingHandlers.slowFadeHtml = {
  update: function(element, valueAccessor, allBindings) {
    var text = ko.unwrap(valueAccessor());
    $(element).fadeOut('slow', function() {
      $(element).html(text);
      $(element).fadeIn('slow');
    });
  }
}

/************* Mobile Header Tools **************/

  var mobileScrolls = 0;
  var searchOpen = true;
  var lastPos = 0;

  function toggleSearchCollapse() {
      $('#slide-nav').slideToggle(250);
      searchOpen = !searchOpen
  }

  $(window).scroll(function() {
      mobileScrolls++;
      var pos = $(window).scrollTop();
      var isScrollingUp = pos < lastPos;
      lastPos = pos;
      if (pos != undefined && pos >= 0) {
          if (mobileScrolls >= 5 && searchOpen) {
              $('#slide-nav').stop();
             $('#slide-nav').animate({
              'top': '0px',
              'margin-top': '0px'
             }, 300);
             searchOpen = false;
          }

          if (mobileScrolls >= 5 && isScrollingUp && !searchOpen) {
              $('#slide-nav').stop();
                 $('#slide-nav').animate({
                'top': '50px'
               }, 300);
               searchOpen = true;
          }
      }
  });

function mainClick() {
  game.addManualClicks();
}

function startGame() {
  var lastLoop = Date.now();
  var lastCheckLoop = Date.now();
	setInterval(function() {
	    var now = Date.now();
	    var elapsedTime = now - lastLoop;
	    
	    lastLoop = now;
	   
      if (elapsedTime < 60000) {
        game.addClicks(game.accessibleDPS.val() * (elapsedTime / CPS_BASE_INTERVAL), true); 
      } else {
        game.handleAwayEarnings(null, elapsedTime)
      }
	}, DISPLAY_LOOP_INTERVAL);

	setInterval(function() {
    var elapsedTime = Date.now() - lastCheckLoop;
    lastCheckLoop = Date.now();
		document.title = game.currentCash.displayVal() + " Dollars - The Idle Class";
		game.checkForMail();
		game.incrementMediumIntervalCounter();
		game.checkTimePlayedAwards();
    game.composedMail().lowerStress(null, null, elapsedTime / CHECK_LOOP_INTERVAL);
    game.incrementWindfallGuarantee(elapsedTime / CHECK_LOOP_INTERVAL);
	}, CHECK_LOOP_INTERVAL);
	
	setInterval(function() {
	  game.saveGame();
    checkSessionLength();
    console.log('checking for obstacles...')
    game.checkForObstacles();
    game.cartel.checkForUpdate();
	}, LONG_INTERVAL);
}

function reloadCharts() {
  if (game.enableCharts()) {
    if (myPieChart) {
      Chart.defaults.global.defaultFontColor='red';
      myLineGraph.data.datasets[0].data = getLineGraphData();
      myLineGraph.options.scales.xAxes[0].ticks.minor.fontColor = game.enableDarkMode() ? "white" : "gray";
      myLineGraph.options.scales.yAxes[0].ticks.minor.fontColor = game.enableDarkMode() ? "white" : "gray";
      myLineGraph.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myLineGraph.update();

      myInvestmentChart.data.datasets[0].data = getInvestmentChartData();
      myInvestmentChart.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myInvestmentChart.update();

      myEmailChart.data.datasets[0].data = getEmailChartData();
      myEmailChart.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myEmailChart.update();

      myClickChart.data.datasets[0].data = getClickChartData();
      myClickChart.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myClickChart.update();

      myPieChart.data.labels = getPieChartLabels();
      myPieChart.data.datasets[0].data = getPieChartData();
      myPieChart.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myPieChart.update();

      myBankruptcyChart.data.labels = getBankruptcyLabels();
      myBankruptcyChart.data.datasets[0].data = getBankruptcyGraphData();
      myBankruptcyChart.options.scales.xAxes[0].ticks.minor.fontColor = game.enableDarkMode() ? "white" : "gray";
      myBankruptcyChart.options.scales.yAxes[0].ticks.minor.fontColor = game.enableDarkMode() ? "white" : "gray";
      myBankruptcyChart.options.legend.labels.fontColor = game.enableDarkMode() ? "white" : "gray";
      myBankruptcyChart.update();
    } else {
      renderCharts();
    }
  }
}

function initializeGame() {
	// Keep the quantity buttons selected after clicking
	$(".btn-group > .btn").click(function(){
    $(this).addClass("active").siblings().removeClass("active");
  });
  
  // Flash the earned amount after every manual cash click
  $(".main-click, .windfall-btn").each(function() {
    $(this).click(function() {
      var ui = $('.click-value-display');
      ui.text('+ ' + game.earnedPerClick.displayVal());
      
      if (ui.is(':animated')) {
        ui.stop().css({opacity:'100'});
      } else {
        ui.show();
      }
      
      ui.fadeOut(500);
    });
  });
  
  document.addEventListener("achievement-earned", function(e) {
    if (e.detail.name !== 'trigger' && game.enableNotifications()) {
      var link = '<a class="alert-link" onclick="selectAchievement(\'' + e.detail.id + '\')" data-toggle="modal" data-target="#upgradeModal">' + e.detail.name  + '</a></div>';
      var alert = getAlertHTML(e.detail.id, 'ACHIEVEMENT', 'alert-warning', link);
      $('#achievement-box').append(alert);

      setTimeout(function() {
        $('.' + e.detail.id).fadeOut();
      }, 4000);
    }
  });
  
  document.addEventListener("employee-unlocked", function(e) {
    if (game.enableNotifications()) {
      var id = 'employee-alert-' + e.detail.id;
      var link = '<a class="alert-link" onclick="selectEmployee(\'' + e.detail.id + '\', \'' + id + '\')" data-toggle="modal" data-target="#unitModal">' + e.detail.name  + '</a></div>';
      var alert = getAlertHTML(id, 'NEW EMPLOYEE', 'alert-info', link);
      $('#achievement-box').append(alert);

      setTimeout(function() {
        $('.' + id).fadeOut();
      }, 4000);
    }
  });

  document.addEventListener("away-earnings", function(e) {
    if (game.enableNotifications()) {
      var details = '<span><b>$' + e.detail  + '</b></span>';
      $('.away-earnings-alert').remove();
      var alert = getAlertHTML('away-earnings-alert', 'CASH EARNED WHILE AWAY', 'alert-success', details);
      $('#achievement-box').append(alert);
    }
  });

  document.addEventListener("acquisition-made", function(e) {
    var details = '<span><b>' + e.detail  + '</b></span>';
    var alert = getAlertHTML('acquisition-made-alert', 'COMPANY ACQUIRED', 'alert-success', details);
    $('#achievement-box').append(alert);
    setTimeout(function() {
      $('.acquisition-made-alert').fadeOut(500, function() {
        $(this).remove();
      })
    }, 3000);
  });

  document.addEventListener("goal-failed", function(e) {
    var details = '<span><b>' + e.detail  + '</b></span>';
    var alert = getAlertHTML('goal-failed-alert', 'GOAL FAILED', 'alert-danger', details);
    $('#achievement-box').append(alert);
    setTimeout(function() {
      $('.goal-failed-alert').fadeOut(500, function() {
        $(this).remove();
      })
    }, 5000);
  });

    document.addEventListener("goal-met", function(e) {
    var details = '<span><b>' + e.detail  + '</b></span>';
    var alert = getAlertHTML('goal-met-alert', 'GOAL SUCCEEDED', 'alert-success', details);
    $('#achievement-box').append(alert);
    setTimeout(function() {
      $('.goal-met-alert').fadeOut(500, function() {
        $(this).remove();
      })
    }, 5000);
  });

  document.addEventListener("cryptic-notification", function(e) {
    var details = '<span><b>' + e.detail  + '</b></span>';
    var id = Date.now();
    var alert = getAlertHTML('cryptic-' + id, 'CLASSIFIED', 'alert-cryptic', details, 'help');
    $('#achievement-box').append(alert);
    setTimeout(function() {
      $('.cryptic-' + id).fadeOut(500, function() {
        $(this).remove();
      })
    }, 5000);
  });

  document.addEventListener("employee-killed", function(e) {
    var details = '<span><b>' + e.detail  + '</b></span>';
    var alert = getAlertHTML('employee-killed-alert', 'SHAMEFUL', 'alert-danger', details);
    $('#achievement-box').append(alert);
    setTimeout(function() {
      $('.employee-killed-alert').fadeOut(500, function() {
        $(this).remove();
      })
    }, 3000);
  });

  document.addEventListener("new-message", function(e) {
    if (game.viewingTab() === 'acquisitions') {
      $('.messages-box').scrollTop($('.messages-box')[0].scrollHeight);
    }
  });
  
  $('#investmentForm').submit(function(e) {
    e.preventDefault();
    var timeTilRipe = getInvestmentFormData();

    if (investType === 'all') {
      var slots = game.totalSimultaneousInvestmentsAllowed.val() - game.activeInvestments().length
      for (var i = 0; i < slots; i++) {
        game.makeInvestment(10, timeTilRipe)
      }
    } else {
      game.makeInvestment(10, timeTilRipe);
    }

    // close the modal
    $('#investmentModal').modal('toggle');
  });

  $('#acquisitionForm').submit(function(e) {
    e.preventDefault();
    game.makeAcquisition();

    // close the modal
    $('#acquisitionModal').modal('toggle');
  });

  $('.modal').on('hidden.bs.modal', function(e) {
      game.viewingModal(null);
  });
  
  // load game data
  game.loadGame();
    
  // Once everything is done, kill the loading screen
  $('#loading-screen').hide();
}

function validateResearch(unitId) {
  var target = $('#research-' + unitId);
  var val = target.val();
  if (val > game.units()[parseInt(unitId)].num.val() || val < 0) {
    target.addClass('error');
  } else {
    target.removeClass('error');
  }
}

function validateElections(unitId) {
  var target = $('#election-' + unitId);
  var val = target.val();
  if (val > game.units()[parseInt(unitId)].num.val() || val < 0) {
    target.addClass('error');
  } else {
    target.removeClass('error');
  }
}

function getInvestmentFormData() {
  var data = $('#investmentForm').serializeArray();
  var time = Number(data[0].value);
  var timeUnit = data[1].value;
  
  // Change time to minutes
  var timeTilRipe = time;
  if (timeUnit === 'Hours') {
    timeTilRipe = time * 60;
  }
  
  return timeTilRipe;
}

function validateInvestment() {
  // Don't allow investments of over a day - 1440 minutes in a day
  var timeTilRipe = getInvestmentFormData();
  if (timeTilRipe > 1440) {
    $('#investmentForm').addClass('error');
    $('.investment-submit').addClass('disabled');
  } else if (timeTilRipe > 0 && game.activeInvestments().length < game.totalSimultaneousInvestmentsAllowed.val()) {
    $('#investmentForm').removeClass('error');
    $('.investment-submit').removeClass('disabled');
  } else {
    $('#investmentForm').removeClass('error');
    $('.investment-submit').addClass('disabled');
  }
}

function getAlertHTML(id, type, colorClass, link, altIcon) {
  return '<div class="' + id + ' alert ' + colorClass + '" role="alert">'
    + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
    +  '<span aria-hidden="true">&times;</span>'
    + '</button>'
    + '<i class="material-icons" style="font-size:48px; color:darkgray;">' + (altIcon ? altIcon : 'check_circle') + '</i>'
    + '<span class="achievement-label">' + type + ':</span>'
    +  '&nbsp;' + link;
}

$('#mailModal').on('hidden.bs.modal', function () {
  game.emailHelpView(false);
  game.composeHelpView(false);
  game.composeView(false);
  $('#inboxToggle').click();
});

$('#productModal').on('hidden.bs.modal', function () {
  game.research().helpView(false)
});

$('#importModal').on('hidden.bs.modal', function () {
  $('#importModal .import-textarea').val('');
});

function selectAchievement(id) {
  $('.' + id).remove();
  game.getAchievementById(id).select();
}

function selectEmployee(unitId, classId) {
  $('.' + classId).remove();
  game.getUnit(unitId).select();
}

function selectInvestmentsTab(id) {
  $('.investments-alert').remove();
}

function markAllAsRead(isAcquisition) {
  game.clearAllEmails(isAcquisition);
}

function importGameData() {
  var enteredData = $('.import-textarea').val();
  game.importGameData(enteredData);
}

function copyToClipboard() {
  $('.export-data').select();
  var s = document.execCommand('copy');
}

function downloadExport() {
  var data = $('.export-data').val();
  var blob = new Blob([data], { type: "text/plain; encoding=utf8" });
  saveData(blob, 'idle-class-save-' + Date.now() + '.txt');    
}

function saveData(blob, fileName) {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

function setBankruptcyModalViewed() {
  game.viewingModal('bankruptcy');
  game.bankruptcyModalViewed(true);
}

function getLineGraphData() {
  return [
    (game.earningsStats()[0].val() - game.earningsStats()[1].val() - game.earningsStats()[2].val() - game.earningsStats()[3].val() - game.earningsStats()[4].val() - game.earningsStats()[5].val() - game.earningsStats()[6].val()) || 0,
    game.earningsStats()[1].val(),
    game.earningsStats()[2].val(),
    game.earningsStats()[3].val(),
    game.earningsStats()[4].val(),
    game.earningsStats()[5].val(),
    game.earningsStats()[6].val()
  ]
}

function getBankruptcyLabels() {
  return game.pastBusinesses().map(function(business) {
    return business.name + ': ' + game.format(business.earned);
  });
}

function getPieChartLabels() {
  return game.units().map(function(unit) {
    return unit.available() ? unit.name() : '?';
  });
}

function getPieChartData() {
  return game.units().map(function(unit) {
    return unit.cps.val();
  });
}

function getInvestmentChartData() {
  return [game.investmentStats()[7].val(), game.investmentStats()[8].val()];
}

function getEmailChartData() {
  return [game.emailStats()[4].val() - game.emailStats()[7].val(), game.emailStats()[7].val()];
}

function getClickChartData() {
  return [game.clickStats()[2].val() - game.clickStats()[6].val(), game.clickStats()[6].val()];
}

function getBankruptcyGraphData() {
  var total = game.pastBusinesses().length;
  var baseSize = 20;
  var sizeCount = 0;
  return game.pastBusinesses().sort(function(a, b) {
    return a.earned - b.earned;
  }).map(function(business) {
    sizeCount += baseSize / total;
    return {
      x: business.date,
      y: business.length,
      r: sizeCount
    };
  });
}

function renderCharts() {
  // var defaultColors = ['#3366CC','#DC3912','#FF9900','#109618','#990099','#3B3EAC','#0099C6',
  // '#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300',
  // '#8B0707','#329262','#5574A6','#3B3EAC'];
  
  var defaultColors = ['#337ab7', '#d9534f', '#f0ad4e', '#5cb85c','#990099','#3B3EAC','#0099C6',
  '#DD4477','#66AA00','#B82E2E','#316395','#994499','#22AA99','#AAAA11','#6633CC','#E67300',
  '#8B0707','#329262','#5574A6','#3B3EAC'];

  // blue: #337ab7 green: #3c763d
  
  // initialize chart
  var ctx = document.getElementById('unitsChart').getContext('2d');
  myPieChart = new Chart(ctx,{
    type: 'pie',
    data: {
      labels: getPieChartLabels(),
      datasets: [{
        label: 'Dollars Per Second',
          backgroundColor: defaultColors,
        data: getPieChartData()
      }]
    },
    options: {
      legend: {
        labels: {
          fontColor: game.enableDarkMode() ? "white" : "gray"
        }
      },
  		tooltips: {
  			callbacks: {
  				label: chartTooltipCallback
  			}
  		}
	  }
  });

  var ctx2 = document.getElementById('investmentsChart').getContext('2d');
  myInvestmentChart = new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: ['Short Investment', 'Long Investment'],
      datasets: [{
        label: 'Investment Lengths',
          backgroundColor: ['#337ab7', '#99bcdb'],
        data: getInvestmentChartData()
      }]
    },
    options: {
      legend: {
        labels: {
          fontColor: game.enableDarkMode() ? "white" : "gray"
        }
      },
      tooltips: {
        callbacks: {
          label: chartTooltipCallback
        }
      }
    }
  });

  var ctx3 = document.getElementById('emailsChart').getContext('2d');
  myEmailChart = new Chart(ctx3, {
    type: 'doughnut',
    data: {
      labels: ['Regular Earnings', 'Urgent Earnings'],
      datasets: [{
        label: 'Email Earnings',
          backgroundColor: ['#addbad', '#5cb85c'],
        data: getEmailChartData()
      }]
    },
    options: {
      legend: {
        labels: {
          fontColor: game.enableDarkMode() ? "white" : "gray"
        }
      },
      tooltips: {
        callbacks: {
          label: chartTooltipCallback
        }
      }
    }
  });

  var ctx4 = document.getElementById('clicksChart').getContext('2d');
  myClickChart = new Chart(ctx4, {
    type: 'doughnut',
    data: {
      labels: ['Regular Earnings', 'Windfall Earnings'],
      datasets: [{
        label: 'Manual Click Earnings',
          backgroundColor: ['#efbab8', '#d9534f'],
        data: getClickChartData()
      }]
    },
    options: {
      legend: {
        labels: {
          fontColor: game.enableDarkMode() ? "white" : "gray"
        }
      },
      tooltips: {
        callbacks: {
          label: chartTooltipCallback
        }
      }
    }
  });
  
  var ctx5 = document.getElementById('earnedComparisonGraph').getContext('2d');
    myLineGraph = new Chart(ctx5, {
      type: 'bar',
      data: {
        labels: ['Employees', 'Clicking', 'Emails', 'Investments', 'R&D', 'Acquisitions', 'Elections'],
        datasets: [{
          label: 'Types of Earnings',
            backgroundColor: ['#337ab7', '#d9534f', '#f0ad4e', '#5cb85c', '#994499', '#3B3EAC', '#0099C6'],
          data: getLineGraphData()
        }]
      },
      options: {
        legend: {
          labels: {
            fontColor: game.enableDarkMode() ? "white" : "gray"
          }
        },
        scales: {
            yAxes: [{
              ticks: {
                fontColor: game.enableDarkMode() ? "white" : "gray",
                callback: function(value, index, values) {
                  return '$' + game.format(value);
                }
              }
            }],
            xAxes: [{
              ticks: {
                fontColor: game.enableDarkMode() ? "white" : "gray"
              }
            }]
        },
        tooltips: {
          callbacks: {
            label: chartTooltipCallback
          }
        }
      }
    });

    var ctx6 = document.getElementById('bankrputcyChart').getContext('2d');
    myBankruptcyChart = new Chart(ctx6, {
      type: 'bubble',
      data: {
        labels: getBankruptcyLabels(),
        datasets: [{
          label: 'Types of Earnings',
          backgroundColor: defaultColors,
          data: getBankruptcyGraphData()
        }]
      },
      options: {
        legend: {
          labels: {
            fontColor: game.enableDarkMode() ? "white" : "gray"
          }
        },
        scales: {
            yAxes: [{
              ticks: {
                fontColor: game.enableDarkMode() ? "white" : "gray",
                callback: function(value, index, values) {
                  return game.getFormattedTime(value)
                }
              }
            }],
            xAxes: [{
              ticks: {
                fontColor: game.enableDarkMode() ? "white" : "gray",
                callback: function(value, index, values) {
                  return new Date(value).toLocaleDateString();
                }
              }
            }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var allData = data.datasets[tooltipItem.datasetIndex].data;
              var tooltipLabel = data.labels[tooltipItem.index];
              return tooltipLabel
            }
          }
        }
      }
    });
}

function chartTooltipCallback(tooltipItem, data) {
  var allData = data.datasets[tooltipItem.datasetIndex].data;
	var tooltipLabel = data.labels[tooltipItem.index];
	var tooltipData = allData[tooltipItem.index];
	var total = 0;
	for (var i in allData) {
		total += allData[i];
	}
	var tooltipPercentage = Math.round((tooltipData / total) * 100);
	return tooltipLabel + ': ' + tooltipPercentage + '%';
}

var got10m, got1h, got6h, got12h, got1d;
function checkSessionLength() {
  var timeInMinutes = (Date.now() - sessionStarted) / 1000 / 60;
  if (timeInMinutes > 60 * 24 && !got1d) {
    got1d = true;
    gaTimeEvent('1-day', timeInMinutes);
  } else if (timeInMinutes > 60 * 12 && !got12h) {
    got12h = true;
    gaTimeEvent('12-hours', timeInMinutes);
  } else if (timeInMinutes > 60 * 6 && !got6h) {
    got6h = true;
    gaTimeEvent('6-hours', timeInMinutes);
  } else if (timeInMinutes > 60 && !got1h) {
    got1h = true;
    gaTimeEvent('1-hour', timeInMinutes);
  } else if (timeInMinutes > 10 && !got10m) {
    got10m = true;
    gaTimeEvent('10-minutes', timeInMinutes);
  }
}

function gaTimeEvent(label, sessionLength) {
  try {
    gtag('event', 'session_length', {
      'event_category': 'business_simulator',
      'event_label': label,
      'value': sessionLength
    });
  } catch (err) {
    console.log('Google Analytics not found');
  }
}


