var memory_loaded = false;
var default_display_style_desktop = 1;
var default_display_style_tablet = 1;
var default_display_style_mobile = 2;
function bodyOnload() {
  memory_loaded = true;
}
$(function() {
  var v12m_size = 5852605;
  var v12_size = 319305;
  var v12_total_size = v12m_size + v12_size;
  var v12_loading_percent = 50;
  var emu;
  var ui;
  var link;
  var progress_bar_height = 20;
  var progress_bar_left = 10;
  //<![CDATA[
    function reset() {
      d0 = 0;
      d1 = 0;
      d2 = 0;
      d3 = 0;
      d4 = 0;
      d5 = 0;
      d6 = 0;
      d7 = 0;
      a0 = 0;
      a1 = 0;
      a2 = 0;
      a3 = 0;
      a4 = 0;
      a5 = 0;
      a6 = 0;
      a8 = 0x4C00;
      a7 = 0x4C00;
      ram = new Uint16Array(131072);
  };
  //]]>
  var loadingMemory = false;
  function loadSimulator() {
    emu = TI68kEmulatorCoreModule(window);
    ui = TI68kEmulatorUIModule(window);
    link = TI68kEmulatorLinkModule(window);
    if (typeof(rom) === "object") {
      emu.setRom(rom);
    }
    emu.setReset(reset);
    var progress_bar = $('#progressbar div');
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 10 / 100) + '%');
    ui.setEmu(emu);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 20 / 100) + '%');
    ui.setLink(link);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 30 / 100) + '%');
    emu.setUI(ui);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 40 / 100) + '%');
    emu.setLink(link);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 50 / 100) + '%');
    link.setEmu(emu);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 60 / 100) + '%');
    link.setUI(ui);
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 70 / 100) + '%');    
    emu.initemu();
    progress_bar.css('width', (v12_loading_percent + (100 - v12_loading_percent) * 80 / 100) + '%');
    $('#calccontainer #calcback').css('display', "block");
    $('#calccontainer #calcscreen').css('display', "block");
    var per = v12_loading_percent + (100 - v12_loading_percent) * 80 / 100;
    var timer = setInterval(function () {
      progress_bar.css('width', per + '%');
      if (per >= 100) {
        clearInterval(timer);
        fadeoutProgressBar();
      }
      per += (100 - v12_loading_percent) * 0.5 / 100;
    }, 50);
  }
  function downloadV12MV12() {
    lscache.addProgressHandler(function(evt) {
      $('#progressbar div').css('width', ((evt.loaded / v12_total_size) * 100 * v12_loading_percent / 100) + '%');
    }).require({ url: './js/ti89rom.js', type: "compressed" }).then(function () {
      lscache.addProgressHandler(function(evt) {
        $('#progressbar div').css('width', (((v12m_size + evt.loaded) / v12_total_size) * 100 * v12_loading_percent / 100) + '%');
      }).require({ url: './js/v12.js' }).then(function () {
        loadSimulator();
      });
    });
  }
  function fadeoutProgressBar() {
    var el = $("#progressbar");
    el.css("opacity", 1);
    var op = 1;
    var timer = setInterval(function () {
      el.css("display", "none");
      if (op <= 0) {
        clearInterval(timer);
        loadingMemory = true;
      }
      op -= 0.05;
      el.css("opacity", op);
    }, 50);
  }
  var displayStyle = 1;
  const calcContainerWidth1 = 9213; const calcContainerLeft1 = 1173; const calcContainerRight1 = 1410;
  const calcContainerHeight1 = 10707; const calcContainerTop1 = 2303; const calcContainerBottom1 = 3087;
  const f1Top1 = 8725; const f1Left1 = 1157; const f2Top1 = 8837; const f2Left1 = 2588; const f3Top1 = 8905; const f3Left1 = 4050;
  const f4Top1 = 8837; const f4Left1 = 5560; const f5Top1 = 8735; const f5Left1 = 7032;
  var pressedFnHeight1 = 867; var pressedFnWidth1 = 867;

  const calcContainerWidth2 = 16277; const calcContainerLeft2 = 2890; const calcContainerRight2 = 1230;
  const calcContainerHeight2 = 11643; const calcContainerTop2 = 890; const calcContainerBottom2 = 830;
  const f1Top2 = 1000; const f1Left2 = 920; const f2Top2 = 2975; const f2Left2 = 920; const f3Top2 = 4940; const f3Left2 = 920;
  const f4Top2 = 6915; const f4Left2 = 920; const f5Top2 = 8910; const f5Left2 = 920;
  var pressedFnHeight2 = 1120; var pressedFnWidth2 = 1120;

  const calcContainerFitLeft = 0;
  const calcBackOffsetTop = 400; const calcBackOffsetRight = 400; const calcBackOffsetBottom = 400; const calcBackOffsetLeft = 400;

  var keysStyle = 1;
  const keysContainerWidth1 = 10510; const keysContainerHeight1 = 15360;
  const keysContainerWidth2 = 20780; const keysContainerHeight2 = 8100;
  const keyDefaultWidth1 = 1880; const keyDefaultHeight1 = 1500;
  const keyDefaultWidth2 = 1680; const keyDefaultHeight2 = 1500;
  const pressedDefaultWidth1 = 1880; const pressedDefaultHeight1 = 1071;
  const pressedDefaultWidth2 = 1680; const pressedDefaultHeight2 = 1071;
  const pressedSvgWidth1 = 2170; const pressedSvgHeight1 = 1500;
  const pressedSvgWidth2 = 2170; const pressedSvgHeight2 = 1500;

  var imageWidth;
  var imageHeight;
  var imageTop;
  var imageLeft;
  var keysContainerHeight;
  var keysWidth;
  var keysHeight;
  var keysTop;
  var keysLeft;
  var keysMarginTop = 5;
  var keysMarginBottom = 5;
  var keysMarginLeft = 5;
  var keysMarginRight = 5;
  var windowWidth = window.innerWidth;
  var windowHeight = window.innerHeight;
  var divideTopRatio = 0.5;
  const minSkinHeight = 100;
  const minKeyboardHeight = 100;
  const adjustHeight = 25;
  var disclaimerExpireFlag = false;
  var disclaimerTooltipVisible = false;
  var adjustBar = document.getElementById('adjustbar');
  var adjustBarTooltipVisible = false;
  adjustBar.style.position = 'absolute';
  adjustBar.style.zIndex = 1;
  adjustBar.style.top = windowHeight * divideTopRatio + 'px';
  adjustBar.style.display = 'block';
  function setDefaultDisplay() {
    var windowWidth = window.innerWidth;
    if (windowWidth >= 1024) {
      displayStyle = default_display_style_desktop;
    } else if (windowWidth < 1024 && windowWidth >= 768) {
      displayStyle = default_display_style_tablet;
    } else {
      displayStyle = default_display_style_mobile;
      if (displayStyle == 2) {
        divideTopRatio = windowWidth * calcContainerHeight2 / calcContainerWidth2 / windowHeight;
      }
    }
  }
  setDefaultDisplay();
  function fadeoutAdjustTooltip() {
    var el = $("#adjustbartooltip");
    var op = parseFloat(el.css("opacity"));
    var timer = setInterval(function () {
      if (op <= 0) {
        clearInterval(timer);
        el.css("display", "none");
      }
      op -= 0.05;
      el.css("opacity", op);
    }, 50);
  }
  function adjustAdjustTooltip(fade = 0) {
    if (adjustBarTooltipVisible) {
      if (fade) {
        fadeoutAdjustTooltip();
      } else {
        var adjustbar_el = $("#adjustbar");
        var adjbartt_el = $("#adjustbartooltip");
        var adjbartt_top = parseInt(adjustbar_el.css('top')) - parseInt(adjbartt_el.css('height'));
        var adjbartt_left = (window.innerWidth - parseInt(adjbartt_el.css('width'))) / 2;
        if (window.innerWidth > 1024) {
          adjbartt_left = (window.innerWidth + imageLeft + imageWidth - parseInt(adjbartt_el.css('width'))) / 2;
        }
        adjbartt_el.css('top', adjbartt_top + 'px');
        adjbartt_el.css('left', adjbartt_left + 'px');
        adjbartt_el.css("display", "block");
        setTimeout(function() { fadeoutAdjustTooltip(); }, 1000 * 7);
      }
    }
  }
  function fadeoutDisclaim() {
    fadeoutDisclaimTooltip();
    var el = $("#disclaimer");
    var op = parseFloat(el.css("opacity"));
    var timer = setInterval(function () {
      if (op <= 0) {
        clearInterval(timer);
        el.css("display", "none");
        adjustBarTooltipVisible = true;
        adjustAdjustTooltip();
      }
      op -= 0.05;
      el.css("opacity", op);
    }, 50);
  }
  function fadeoutDisclaimTooltip() {
    var el = $("#disclaimertooltip");
    var op = parseFloat(el.css("opacity"));
    var timer = setInterval(function () {
      if (op <= 0) {
        clearInterval(timer);
        el.css("display", "none");
      }
      op -= 0.05;
      el.css("opacity", op);
    }, 50);
  }
  function checkDisclaimer() {
    var disclaimerExpire = localStorage.getItem('disclaimerExpire') || 0;
    var cur_d = new Date();
    var cur_dt = cur_d.getTime();
    var expire_d = cur_d.getTime() + (7 * 24 * 60 * 60 * 1000);
    if (disclaimerExpire) {
      if (disclaimerExpire < cur_dt) {
        disclaimerExpireFlag = true;
      }
    } else {
      disclaimerExpireFlag = true;
    }
    if (disclaimerExpireFlag) {
      localStorage.setItem('disclaimerExpire', expire_d);
      var disclaimer_el = $("#disclaimer");
      var disclaimert_el = $("#disclaimertooltip");
      disclaimer_el.css("display", "block");
      var disclaimert_top = parseInt(disclaimer_el.css('top')) - parseInt(disclaimert_el.css('height'));
      var disclaimert_left = (window.innerWidth - parseInt(disclaimert_el.css('width'))) / 2;
      disclaimert_el.css('top', disclaimert_top + 'px');
      disclaimert_el.css('left', disclaimert_left + 'px');
      disclaimert_el.css("display", "block");
      document.onclick = fadeoutDisclaim;
    }
  }
  checkDisclaimer();
  function adjustFnBtn(pressedimg, fnbutton, btop, bleft, bwidth, bheight, btnkey) {
    $('#' + pressedimg).css('top', btop + "px");
    $('#' + pressedimg).css('left', bleft + "px");
    $('#' + pressedimg).css('width', bwidth + "px");
    $('#' + pressedimg).css('height', bheight + "px");
    $('#' + fnbutton).css('top', btop + "px");
    $('#' + fnbutton).css('left', bleft + "px");
    $('#' + fnbutton).css('width', bwidth + "px");
    $('#' + fnbutton).css('height', bheight + "px");
    mapKeyboardButton(fnbutton, btnkey, pressedimg);
  }
  function adjustFnBtns() {
    var calcContainerHeight = calcContainerHeight1; var calcContainerWidth = calcContainerWidth1;
    var pressedContainerHeight = pressedFnHeight1; var pressedContainerWidth = pressedFnWidth1;
    var f1Key = 47; var f2Key = 39; var f3Key = 31; var f4Key = 23; var f5Key = 15;
    var f1Top = f1Top1; var f1Left = f1Left1; var f2Top = f2Top1; var f2Left = f2Left1; var f3Top = f3Top1; var f3Left = f3Left1;
    var f4Top = f4Top1; var f4Left = f4Left1; var f5Top = f5Top1; var f5Left = f5Left1;
    if (displayStyle == 2) {
      f1Top = f1Top2; f1Left = f1Left2; f2Top = f2Top2; f2Left = f2Left2; f3Top = f3Top2; f3Left = f3Left2;
      f4Top = f4Top2; f4Left = f4Left2; f5Top = f5Top2; f5Left = f5Left2;
      calcContainerHeight = calcContainerHeight2; calcContainerWidth = calcContainerWidth2;
      pressedContainerHeight = pressedFnHeight2; pressedContainerWidth = pressedFnWidth2;
    }
    fnWidth = imageWidth * pressedContainerWidth / calcContainerWidth;
    fnHeight = imageHeight * pressedContainerHeight / calcContainerHeight;
    var fnTop; var fnLeft;
    fnTop = imageHeight * f1Top / calcContainerHeight + imageTop;
    fnLeft = imageWidth *  f1Left / calcContainerWidth + imageLeft;
    adjustFnBtn("f1pressedimg", "f1button", fnTop, fnLeft, fnWidth, fnHeight, f1Key);
    fnTop = imageHeight * f2Top / calcContainerHeight + imageTop;
    fnLeft = imageWidth *  f2Left / calcContainerWidth + imageLeft;
    adjustFnBtn("f2pressedimg", "f2button", fnTop, fnLeft, fnWidth, fnHeight, f2Key);
    fnTop = imageHeight * f3Top / calcContainerHeight + imageTop;
    fnLeft = imageWidth *  f3Left / calcContainerWidth + imageLeft;
    adjustFnBtn("f3pressedimg", "f3button", fnTop, fnLeft, fnWidth, fnHeight, f3Key);
    fnTop = imageHeight * f4Top / calcContainerHeight + imageTop;
    fnLeft = imageWidth *  f4Left / calcContainerWidth + imageLeft;
    adjustFnBtn("f4pressedimg", "f4button", fnTop, fnLeft, fnWidth, fnHeight, f4Key);
    fnTop = imageHeight * f5Top / calcContainerHeight + imageTop;
    fnLeft = imageWidth *  f5Left / calcContainerWidth + imageLeft;
    adjustFnBtn("f5pressedimg", "f5button", fnTop, fnLeft, fnWidth, fnHeight, f5Key);
  }
  function adjustKeyboardBtn(areaimg, btnimg, pressedimg, btop, bleft, btnkey = -1, keyType = 1, bwidth = -1, bheight = -1, ctop = 0, cleft = 0, pwidth =  -1, pheight = -1, ptop = -1, pleft = -1) {
    var keyContainerWidth = keysContainerWidth1; var keyContainerHeight = keysContainerHeight1;
    var keyContinerTop = keysTop;
    if (keysStyle == 2) {
      keyContainerWidth = keysContainerWidth2;
      keyContainerHeight = keysContainerHeight2;
    }
    var xRatio = 1;
    var yRatio = 1;
    if (keyType == 1 || keyType == 3) {
      if (bwidth == -1) { bwidth = keyDefaultWidth1; }
      if (bheight == -1) { bheight = keyDefaultHeight1; }
    } else if (keyType == 2 || keyType == 4) {
      if (bwidth == -1) { bwidth = keyDefaultWidth2; }
      if (bheight == -1) { bheight = keyDefaultHeight2; }
    }
    if (keyType == 3) {
      xRatio = bwidth / keyDefaultWidth1;
      yRatio = bheight / keyDefaultHeight1;
    } else if (keyType == 4) {
      xRatio = bwidth / keyDefaultWidth2;
      yRatio = bheight / keyDefaultHeight2;
    }
    var xyRatio = xRatio;
    if (yRatio > xyRatio) { xyRatio = yRatio; }
    var buttonWidth = keysWidth * bwidth / keyContainerWidth * xyRatio;
    var buttonHeight = keysHeight * bheight / keyContainerHeight * xyRatio;
    var buttonTop = keysHeight * (btop + ctop / 2) / keyContainerHeight + keyContinerTop;
    var buttonLeft = keysWidth * (bleft + cleft / 2) / keyContainerWidth + keysLeft;
    if (keyType == 1 || keyType == 3) {
      buttonTop = buttonTop + (bheight - keyDefaultHeight1) / 2 * keysHeight / keyContainerHeight;
      buttonLeft = buttonLeft - (bwidth - keyDefaultWidth1) / 2 * keysWidth / keyContainerWidth;
    } else if (keyType == 2 || keyType == 4) {
      buttonTop = buttonTop + (bheight - keyDefaultHeight2) / 2 * keysHeight / keyContainerHeight;
      buttonLeft = buttonLeft - (bwidth - keyDefaultWidth2) / 2 * keysWidth / keyContainerWidth;
    }
    $('#' + btnimg).css('top', buttonTop + "px");
    $('#' + btnimg).css('left', buttonLeft + "px");
    $('#' + btnimg).css('width', buttonWidth + "px");
    $('#' + btnimg).css('height', buttonHeight + "px");
    xRatio = 1;
    yRatio = 1;
    if (keyType == 5) {
      pwidth = bwidth;
      pheight = bheight;
    }
    if (keyType == 1 || keyType == 3) {
      if (pwidth == -1) { pwidth = pressedSvgWidth1; }
      if (pheight == -1) { pheight = pressedSvgHeight1; }
      if (ptop == -1) { ptop = 0; }
      if (pleft == -1) { pleft = 0; }
    } else if (keyType == 2 || keyType == 4) {
      if (pwidth == -1) { pwidth = pressedSvgWidth2; }
      if (pheight == -1) { pheight = pressedSvgHeight2; }
    }
    if (keyType == 3) {
      xRatio = pwidth / pressedSvgWidth1;
      yRatio = pheight / pressedSvgHeight1;
    } else if (keyType == 4) {
      xRatio = pwidth / pressedSvgWidth2;
      yRatio = pheight / pressedSvgHeight2;
    }
    xyRatio = xRatio;
    if (yRatio > xyRatio) { xyRatio = yRatio; }
    if (keyType == 1 || keyType == 3) {
      pwidth = pwidth * pressedDefaultWidth1 / pressedSvgWidth1;
      pheight = pheight * pressedDefaultHeight1 / pressedSvgHeight1;
    } else if (keyType == 2 || keyType == 4) {
      pwidth = pwidth * pressedDefaultWidth2 / pressedSvgWidth2;
      pheight = pheight * pressedDefaultHeight2 / pressedSvgHeight2;
    }
    var pressedWidth = keysWidth * pwidth / keyContainerWidth * xyRatio;
    var pressedHeight = keysHeight * pheight / keyContainerHeight * xyRatio;
    var pressedTop = keysHeight * (btop + bheight - pheight + ptop) / keyContainerHeight + keyContinerTop;
    var pressedLeft = keysWidth * (bleft + pleft) / keyContainerWidth + keysLeft;
    $('#' + areaimg).css('top', pressedTop + "px");
    $('#' + areaimg).css('left', pressedLeft + "px");
    $('#' + areaimg).css('width', pressedWidth + "px");
    $('#' + areaimg).css('height', pressedHeight + "px");
    if (keyType == 1 || keyType == 3) {
      pressedTop = pressedTop + (pheight - pressedDefaultHeight1) / 2 * keysHeight / keyContainerHeight;
      pressedLeft = pressedLeft - (pwidth - pressedDefaultWidth1) / 2 * keysWidth / keyContainerWidth;
    } else if (keyType == 2 || keyType == 4) {
      pressedTop = pressedTop + (pheight - pressedDefaultHeight2) / 2 * keysHeight / keyContainerHeight;
      pressedLeft = pressedLeft - (pwidth - pressedDefaultWidth2) / 2 * keysWidth / keyContainerWidth;
    }
    if (keyType == 3 || keyType == 4) {
      pressedTop = pressedTop + ctop / 4 * keysHeight / keyContainerHeight;
    }
    $('#' + pressedimg).css('top', pressedTop + "px");
    $('#' + pressedimg).css('left', pressedLeft + "px");
    $('#' + pressedimg).css('width', pressedWidth + "px");
    $('#' + pressedimg).css('height', pressedHeight + "px");
    if (btnkey >= 0) {
      mapKeyboardButton(areaimg, btnkey, pressedimg);
    }
  }
  function adjustKeyboardBtns() {
    if (keysStyle == 1) {
      adjustKeyboardBtn("2ndbutton", "2ndbuttonimg", "2ndpressedimg",                                           1260,    0,  4);
      adjustKeyboardBtn("arrowupbutton", "arrowupbuttonimg", "arrowuppressedimg",                               1260, 2080,  5,  1,    -1,   -1,  0,   0,  -1,  -1,  25);
      adjustKeyboardBtn("escbutton", "escbuttonimg", "escpressedimg",                                           1260, 4160, 48, 1, 2130, 1500,   0,  94);
      adjustKeyboardBtn("yellowbutton", "yellowbuttonimg", "yellowpressedimg",                                  2710,    0,  6, 1,    -1,   -1,  0,   0,  -1,  -1,  9);
      adjustKeyboardBtn("alphabutton", "alphabuttonimg", "alphapressedimg",                                     2760, 2080,  7);
      adjustKeyboardBtn("appsbutton", "appsbuttonimg", "appspressedimg",                                        2760, 4160, 40);
      adjustKeyboardBtn("keyleftbutton", "keyleftbuttonimg", "keyleftpressedimg",                               1405, 6390,  1, 5, 1380, 1500);
      adjustKeyboardBtn("keyupbutton", "keyupbuttonimg", "keyuppressedimg",                                        0, 7770,  0, 5, 1380, 1960);
      adjustKeyboardBtn("keyrightbutton", "keyrightbuttonimg", "keyrightpressedimg",                            1405, 9150,  3, 5, 1380, 1500);
      adjustKeyboardBtn("keydownbutton", "keydownbuttonimg", "keydownpressedimg",                               2300, 7770,  2, 5, 1380, 1960);
      adjustKeyboardBtn("homebutton", "homebuttonimg", "homepressedimg",                                        4260,   0,  46, 1,   -1,   -1,  0,   0,  -1,  -1,  9);
      adjustKeyboardBtn("modebutton", "modebuttonimg", "modepressedimg",                                        4260, 2080, 38, 1,   -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("catalogbutton", "catalogbuttonimg", "catalogpressedimg",                               4260, 4160, 30, 1,   -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("arrowbutton", "arrowbuttonimg", "arrowpressedimg",                                     4260, 6240, 22, 1,   -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("clearbutton", "clearbuttonimg", "clearpressedimg",                                     4260, 8320, 14, 1,   -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("xbutton", "xbuttonimg", "xpressedimg",                                                 5760,   0,  45, 1,   -1,   -1,   0,   0,   -1,  -1,  11);
      adjustKeyboardBtn("ybutton", "ybuttonimg", "ypressedimg",                                                 5760, 2080, 37, 3, 1900, 1550, -260, -60,  -1,  -1,  12);
      adjustKeyboardBtn("zbutton", "zbuttonimg", "zpressedimg",                                                 5760, 4160, 29, 3, 1900, 1550, -280, -50,  -1,  -1,  31);
      adjustKeyboardBtn("tbutton", "tbuttonimg", "tpressedimg",                                                 5760, 6240, 21, 3, 1900, 1550, -260, -60,  -1,  -1,  19);
      adjustKeyboardBtn("upbutton", "upbuttonimg", "uppressedimg",                                              5760, 8320, 13, 1,   -1,   -1,    0,   0,  -1,  -1,  9);
      adjustKeyboardBtn("equalbutton", "equalbuttonimg", "equalpressedimg",                                     7260,   0,  44, 1,   -1,   -1,   0,   0,   -1,  -1,  5);
      adjustKeyboardBtn("leftparenthesesbutton", "leftparenthesesbuttonimg", "leftparenthesespressedimg",       7260, 2080, 36, 1,   -1,   -1,   0,   0,   -1,  -1,  5);
      adjustKeyboardBtn("rightparenthesesbutton", "rightparenthesesbuttonimg", "rightparenthesespressedimg",    7260, 4160, 28, 1,   -1,   -1,   0,   0,   -1,  -1,  3);
      adjustKeyboardBtn("commabutton", "commabuttonimg", "commapressedimg",                                     7260, 6240, 20, 1,   -1,   -1,   0,   0,   -1,  -1,  5);
      adjustKeyboardBtn("dividebutton", "dividebuttonimg", "dividepressedimg",                                  7260, 8320, 12, 1,   -1,   -1,   0,   0,   -1,  -1,  3);
      adjustKeyboardBtn("verticalbutton", "verticalbuttonimg", "verticalpressedimg",                            8760,   0,  43, 1,   -1,   -1,   0,   0,   -1,  -1,  5);
      adjustKeyboardBtn("7button", "7buttonimg", "7pressedimg",                                                 8860, 2080, 35, 2);
      adjustKeyboardBtn("8button", "8buttonimg", "8pressedimg",                                                 8860, 4160, 27, 2);
      adjustKeyboardBtn("9button", "9buttonimg", "9pressedimg",                                                 8860, 6240, 19, 2);
      adjustKeyboardBtn("multiplybutton", "multiplybuttonimg", "multiplypressedimg",                            8760, 8320, 11);
      adjustKeyboardBtn("eebutton", "eebuttonimg", "eepressedimg",                                              10260,   0,  42, 1,    -1,   -1,   0,   0,  -1,  -1,  12);
      adjustKeyboardBtn("4button", "4buttonimg", "4pressedimg",                                                 10460, 2080, 34, 2);
      adjustKeyboardBtn("5button", "5buttonimg", "5pressedimg",                                                 10460, 4160, 26, 2);
      adjustKeyboardBtn("6button", "6buttonimg", "6pressedimg",                                                 10460, 6240, 18, 2);
      adjustKeyboardBtn("minusbutton", "minusbuttonimg", "minuspressedimg",                                     10260, 8320, 10, 1);
      adjustKeyboardBtn("stobutton", "stobuttonimg", "stopressedimg",                                           11760,   0,  41, 1,    -1,   -1,   0,   0,  -1,  -1,  11);
      adjustKeyboardBtn("1button", "1buttonimg", "1pressedimg",                                                 12060, 2080, 33, 2);
      adjustKeyboardBtn("2button", "2buttonimg", "2pressedimg",                                                 12060, 4160, 25, 2);
      adjustKeyboardBtn("3button", "3buttonimg", "3pressedimg",                                                 12060, 6240, 17, 2);
      adjustKeyboardBtn("plusbutton", "plusbuttonimg", "pluspressedimg",                                        11760, 8320, 9);
      adjustKeyboardBtn("onbutton", "onbuttonimg", "onpressedimg",                                              13260,   0, 407, 6, 1880, 1800, 0, 0, 1880, 1371);
      adjustKeyboardBtn("0button", "0buttonimg", "0pressedimg",                                                 13660, 2080, 32, 2);
      adjustKeyboardBtn("dotbutton", "dotbuttonimg", "dotpressedimg",                                           13660, 4160, 24, 2);
      adjustKeyboardBtn("complexminusbutton", "complexminusbuttonimg", "complexminuspressedimg",                13660, 6240, 16, 2);
      adjustKeyboardBtn("enterbutton", "enterbuttonimg", "enterpressedimg",                                     13260, 8320,  8, 6, 1880, 1800, 0, 0, 1880, 1371);
    } else {
      adjustKeyboardBtn("2ndbutton", "2ndbuttonimg", "2ndpressedimg",                                              0,     0, 4);
      adjustKeyboardBtn("arrowupbutton", "arrowupbuttonimg", "arrowuppressedimg",                                  0,  2080, 5,  1,   -1,   -1,  0,   0,  -1,  -1,  20);
      adjustKeyboardBtn("escbutton", "escbuttonimg", "escpressedimg",                                              0,  4160, 48, 1, 2130, 1500, 0, 94);
      adjustKeyboardBtn("leftparenthesesbutton", "leftparenthesesbuttonimg", "leftparenthesespressedimg",          0,  6240, 36,  1,   -1,   -1,  0,   0,  -1,  -1,  6);
      adjustKeyboardBtn("rightparenthesesbutton", "rightparenthesesbuttonimg", "rightparenthesespressedimg",       0,  8320, 28);
      adjustKeyboardBtn("clearbutton", "clearbuttonimg", "clearpressedimg",                                        0, 10400, 14);
      adjustKeyboardBtn("arrowbutton", "arrowbuttonimg", "arrowpressedimg",                                        0, 12480, 22);
      adjustKeyboardBtn("dividebutton", "dividebuttonimg", "dividepressedimg",                                     0, 14560, 12);
      adjustKeyboardBtn("keyleftbutton", "keyleftbuttonimg", "keyleftpressedimg",                               3175, 16640,  1, 5, 1380, 1500);
      adjustKeyboardBtn("keyupbutton", "keyupbuttonimg", "keyuppressedimg",                                     1770, 18020,  0, 5, 1380, 1960);
      adjustKeyboardBtn("keyrightbutton", "keyrightbuttonimg", "keyrightpressedimg",                            3175, 19400,  3, 5, 1380, 1960);
      adjustKeyboardBtn("keydownbutton", "keydownbuttonimg", "keydownpressedimg",                               4070, 18020,  2, 5, 1380, 1960);
      adjustKeyboardBtn("yellowbutton", "yellowbuttonimg", "yellowpressedimg",                                  1450,     0,  6, 1,    -1,   -1,  0,   0,  -1,  -1,  9);
      adjustKeyboardBtn("alphabutton", "alphabuttonimg", "alphapressedimg",                                     1500,  2080,  7);
      adjustKeyboardBtn("appsbutton", "appsbuttonimg", "appspressedimg",                                        1500,  4160, 40);
      adjustKeyboardBtn("equalbutton", "equalbuttonimg", "equalpressedimg",                                     1500,  6240, 44);
      adjustKeyboardBtn("7button", "7buttonimg", "7pressedimg",                                                 1500,  8320, 35, 2);
      adjustKeyboardBtn("8button", "8buttonimg", "8pressedimg",                                                 1500, 10400, 27, 2);
      adjustKeyboardBtn("9button", "9buttonimg", "9pressedimg",                                                 1500, 12480, 19, 2);
      adjustKeyboardBtn("multiplybutton", "multiplybuttonimg", "multiplypressedimg",                            1500, 14560, 11);
      adjustKeyboardBtn("homebutton", "homebuttonimg", "homepressedimg",                                        3100,    0,  46, 1,    -1,   -1,  0,   0,  -1,  -1,  12);
      adjustKeyboardBtn("modebutton", "modebuttonimg", "modepressedimg",                                        3100,  2080, 38, 1,    -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("catalogbutton", "catalogbuttonimg", "catalogpressedimg",                               3100,  4160, 30, 1,    -1,   -1,  0,   0,  -1,  -1,  5);
      adjustKeyboardBtn("upbutton", "upbuttonimg", "uppressedimg",                                              3100,  6240, 13, 1,    -1,   -1,   0,   0,  -1,  -1,  8);
      adjustKeyboardBtn("4button", "4buttonimg", "4pressedimg",                                                 3100,  8320, 34, 2);
      adjustKeyboardBtn("5button", "5buttonimg", "5pressedimg",                                                 3100, 10400, 26, 2);
      adjustKeyboardBtn("6button", "6buttonimg", "6pressedimg",                                                 3100, 12480, 18, 2);
      adjustKeyboardBtn("minusbutton", "minusbuttonimg", "minuspressedimg",                                     3100, 14560, 10, 1);
      adjustKeyboardBtn("verticalbutton", "verticalbuttonimg", "verticalpressedimg",                            4700,     0, 43);
      adjustKeyboardBtn("tbutton", "tbuttonimg", "tpressedimg",                                                 4700,  2080, 21, 3, 1900, 1550, -260, -60,  -1,  -1,  15);
      adjustKeyboardBtn("ybutton", "ybuttonimg", "ypressedimg",                                                 4700,  4160, 37, 3, 1900, 1550, -260, -60,  -1,  -1,  12);
      adjustKeyboardBtn("xbutton", "xbuttonimg", "xpressedimg",                                                 4700,  6240, 45, 1,    -1,   -1,  0,    0,  -1,  -1,  11);
      adjustKeyboardBtn("1button", "1buttonimg", "1pressedimg",                                                 4700,  8320, 33, 2);
      adjustKeyboardBtn("2button", "2buttonimg", "2pressedimg",                                                 4700, 10400, 25, 2);
      adjustKeyboardBtn("3button", "3buttonimg", "3pressedimg",                                                 4700, 12480, 17, 2);
      adjustKeyboardBtn("plusbutton", "plusbuttonimg", "pluspressedimg",                                        4700, 14560, 9);
      adjustKeyboardBtn("eebutton", "eebuttonimg", "eepressedimg",                                              6300,     0, 42, 1,    -1,   -1,   0,   0,  -1,  -1,  12);
      adjustKeyboardBtn("stobutton", "stobuttonimg", "stopressedimg",                                           6300,  2080, 41, 1,    -1,   -1,   0,   0,  -1,  -1,  11);
      adjustKeyboardBtn("zbutton", "zbuttonimg", "zpressedimg",                                                 6300,  4160, 29, 3, 1900, 1550, -210, -50,  -1,  -1,  35);
      adjustKeyboardBtn("commabutton", "commabuttonimg", "commapressedimg",                                     6300,  6240, 20, 1,    -1,   -1,   0,   0,  -1,  -1,  2);
      adjustKeyboardBtn("0button", "0buttonimg", "0pressedimg",                                                 6300,  8320, 32, 2);
      adjustKeyboardBtn("dotbutton", "dotbuttonimg", "dotpressedimg",                                           6300, 10400, 24, 2);
      adjustKeyboardBtn("complexminusbutton", "complexminusbuttonimg", "complexminuspressedimg",                6300, 12480, 16, 2);
      adjustKeyboardBtn("enterbutton", "enterbuttonimg", "enterpressedimg",                                     6300, 14560,  8,  6, 1880, 1800, 0, 0, 1880, 1371);
      adjustKeyboardBtn("onbutton", "onbuttonimg", "onpressedimg",                                                  0,     0,    0,    0,  0,   0);
    }
  }
  function adjustComponentsSize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    var canvasWidth = windowWidth;
    var canvasHeight = windowHeight * divideTopRatio;
    var calcContainerWidth = calcContainerWidth1; var calcContainerLeft = calcContainerLeft1; var calcContainerRight = calcContainerRight1;
    var calcContainerHeight = calcContainerHeight1; var calcContainerTop = calcContainerTop1; var calcContainerBottom = calcContainerBottom1;
    if (displayStyle == 2) {
      calcContainerWidth = calcContainerWidth2; calcContainerLeft = calcContainerLeft2; calcContainerRight = calcContainerRight2;
      calcContainerHeight = calcContainerHeight2; calcContainerTop = calcContainerTop2; calcContainerBottom = calcContainerBottom2;
    }
    if (windowWidth > 768) {
      canvasWidth = canvasHeight * calcContainerWidth / calcContainerHeight;
    }

    $('#adjustbar').css('top', windowHeight * divideTopRatio);
    adjustAdjustTooltip(1);
    var disclaimer_height = parseInt($('#disclaimer-content').height());
    $('#disclaimer').css('height', (disclaimer_height + 40) + 'px');
    var xRatio = canvasHeight / calcContainerHeight;
    var yRatio = canvasWidth / calcContainerWidth;
    var xyRatio = xRatio;
    if (yRatio < xyRatio) { xyRatio = yRatio; }
    imageWidth = calcContainerWidth * xyRatio;
    imageHeight = calcContainerHeight * xyRatio;
    imageTop = (canvasHeight - imageHeight) / 2;
    imageLeft = (windowWidth - imageWidth) / 2;
    if (displayStyle == 2) {
      var imageFitleft = imageWidth * calcContainerFitLeft / calcContainerWidth;
      if (windowWidth >= 768) {
        if (imageWidth + imageFitleft <= windowWidth) {
          imageLeft = imageLeft - imageFitleft;
        }
      }
    }
    if (displayStyle == 1) {
      if (loadingMemory) {
        $('#calccontainer #calcimg').css('display', "block");
        $('#calccontainer #calcimg2').css('display', "none");
      }
      $('#calccontainer #calcimg').css('top', imageTop + "px");
      $('#calccontainer #calcimg').css('left', imageLeft + "px");
      $('#calccontainer #calcimg').css('width', imageWidth + "px");
      $('#calccontainer #calcimg').css('height', imageHeight + "px");
    } else {
      if (loadingMemory) {
        $('#calccontainer #calcimg').css('display', "none");
        $('#calccontainer #calcimg2').css('display', "block");
      }
      $('#calccontainer #calcimg2').css('top', imageTop + "px");
      $('#calccontainer #calcimg2').css('left', imageLeft + "px");
      $('#calccontainer #calcimg2').css('width', (imageWidth + 1) + "px");
      $('#calccontainer #calcimg2').css('height', (imageHeight + 1) + "px");
    }

    keysContainerHeight = windowHeight - canvasHeight;
    keysHeight = keysContainerHeight - keysMarginTop - keysMarginBottom;
    keysWidth = keysHeight * keysContainerWidth1 / keysContainerHeight1;
    if (keysStyle == 2) {
      keysHeight = keysHeight - adjustHeight;
      keysWidth = keysHeight * keysContainerWidth2 / keysContainerHeight2;
    }
    if (keysWidth > (windowWidth - keysMarginLeft - keysMarginRight)) {
      keysHeight = keysHeight * (windowWidth - keysMarginLeft - keysMarginRight) / keysWidth;
      keysWidth = windowWidth - keysMarginLeft - keysMarginRight;
    }
    keysLeft = (windowWidth - keysWidth) / 2;
    keysTop = (keysContainerHeight - keysHeight- keysMarginTop - keysMarginBottom) / 2 + keysMarginTop;
    if (keysStyle == 2) {
      keysTop = (keysContainerHeight - keysHeight- keysMarginTop - keysMarginBottom - adjustHeight) / 2 + keysMarginTop + adjustHeight;
    }
    $('#keyboardcontainer').css('height', keysContainerHeight);
    adjustKeyboardBtns();
    
    var screenTop = imageTop +  imageHeight * calcContainerTop / calcContainerHeight;
    var screenLeft = imageLeft + imageWidth * calcContainerLeft / calcContainerWidth;
    var screenWidth = imageWidth * (calcContainerWidth - calcContainerLeft - calcContainerRight) / calcContainerWidth;
    var screenHeight = imageHeight * (calcContainerHeight - calcContainerTop - calcContainerBottom) / calcContainerHeight;
    $('#calccontainer #screen').css('top', screenTop + "px");
    $('#calccontainer #screen').css('left', screenLeft + "px");
    $('#calccontainer #screen').css('width', screenWidth + "px");
    $('#calccontainer #screen').css('height', screenHeight + "px");
    $('#progressbar').css('top', (screenTop + screenHeight / 2 - progress_bar_height / 2) + "px");
    $('#progressbar').css('width', (screenWidth - progress_bar_left * 2) + "px");
    $('#progressbar').css('left', (screenLeft + progress_bar_left) + "px");

    if (windowWidth > 768) {
      $('#calccontainer #calcback').css('top', (screenTop - calcBackOffsetTop * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcback').css('left', (screenLeft - calcBackOffsetLeft * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcback').css('width', (screenWidth + (calcBackOffsetLeft + calcBackOffsetRight) * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcback').css('height', (screenHeight + (calcBackOffsetTop + calcBackOffsetBottom) * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcsceen').css('top', (screenTop - calcBackOffsetTop * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcsceen').css('left', (screenLeft - calcBackOffsetLeft * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcsceen').css('width', (screenWidth + (calcBackOffsetLeft + calcBackOffsetRight) * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcsceen').css('height',(screenHeight + (calcBackOffsetTop + calcBackOffsetBottom) * screenHeight / calcContainerHeight) + "px");
    } else {
      $('#calccontainer #calcback').css('top', (screenTop - calcBackOffsetTop * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcback').css('left', (screenLeft - calcBackOffsetLeft * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcback').css('width', (screenWidth + (calcBackOffsetLeft + calcBackOffsetRight) * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcback').css('height', (screenHeight + (calcBackOffsetTop + calcBackOffsetBottom) * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcsceen').css('top', (screenTop - calcBackOffsetTop * screenHeight / calcContainerHeight) + "px");
      $('#calccontainer #calcsceen').css('left', (screenLeft - calcBackOffsetLeft * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcsceen').css('width', (screenWidth + (calcBackOffsetLeft + calcBackOffsetRight) * screenWidth / calcContainerWidth) + "px");
      $('#calccontainer #calcsceen').css('height',(screenHeight + (calcBackOffsetTop + calcBackOffsetBottom) * screenHeight / calcContainerHeight) + "px");
    }

    adjustFnBtns();
  }
  window.onresize = adjustComponentsSize;
  adjustComponentsSize();
  if (!disclaimerExpireFlag) {
    adjustBarTooltipVisible = true;
    adjustAdjustTooltip();
  }
  function displayElements() {
    if (displayStyle == 1) {
      $('#calccontainer #calcimg').css('display', "block");
      $('#calccontainer #calcimg2').css('display', "none");
    } else {
      $('#calccontainer #calcimg').css('display', "none");
      $('#calccontainer #calcimg2').css('display', "block");
    }
    $('#keyboardcontainer').css('display', 'block');
    $('#progressbar').css('display', 'block');
  }
  displayElements();
  loadSimulator();
  function mapKeyboardButton(btnid, key, imgid) {
    var button_el = document.getElementById(btnid);
    var image_el = document.getElementById(imgid);
    button_el.addEventListener("mousedown", function() { emu.setKey(key, 1); image_el.style.display = "block"; });
    button_el.addEventListener("touchstart", function() { emu.setKey(key, 1); image_el.style.display = "block"; });
    button_el.addEventListener("mouseup", function() { emu.setKey(key, 0); image_el.style.display = "none"; });
    button_el.addEventListener("touchend", function() { emu.setKey(key, 0); image_el.style.display = "none"; });
    button_el.addEventListener("touchleave", function() { emu.setKey(key, 0); image_el.style.display = "none"; });
    button_el.addEventListener("touchcancel", function() { emu.setKey(key, 0); image_el.style.display = "none"; });
  }
  adjustBar.onmousedown = function(event) {
    if (!loadingMemory) { return; }
    let limitLeft = adjustBar.getBoundingClientRect().left;
    let limitRight = adjustBar.getBoundingClientRect().right;
    let shiftY = event.clientY - adjustBar.getBoundingClientRect().top;
    adjustBar.style.position = 'absolute';
    adjustBar.style.zIndex = 1;
    document.body.append(adjustBar);
    moveAt(event.pageX, event.pageY);
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
    adjustBar.onmouseup = function() {
      addMoveEvent = false;
      $("#adjustbar").removeClass('clicked');
      document.removeEventListener('mousemove', onMouseMove);
      adjustBar.onmouseup = null;
    };
    var addMoveEvent = false;
    function moveAt(pageX, pageY) {
      var tempDivideTop = pageY - shiftY;
      if ((windowHeight - minKeyboardHeight) < tempDivideTop) {
        if (keysStyle == 1) {
          keysStyle = 2;
        } else {
          keysStyle = 1;
        }
        adjustComponentsSize();
      }
      if (minSkinHeight > tempDivideTop) {
        if (displayStyle == 1) {
          displayStyle = 2;
        } else {
          displayStyle = 1;
        }
        adjustComponentsSize();
      }
      if ( (minSkinHeight <= tempDivideTop) && ((windowHeight - minKeyboardHeight) >= tempDivideTop) &&
        (pageX >= limitLeft) && (pageX <= limitRight) ) {
        divideTopRatio = tempDivideTop / windowHeight;
        if (!$("#adjustbar").hasClass('clicked')) {
          $("#adjustbar").addClass('clicked');
        }
        adjustComponentsSize();
        if (!addMoveEvent) {
          addMoveEvent = true;
          document.addEventListener('mousemove', onMouseMove);
        }
      } else {
        addMoveEvent = false;
        $("#adjustbar").removeClass('clicked');
        document.removeEventListener('mousemove', onMouseMove);
      }
    }
  };
  adjustBar.ondragstart = function() {
    if (!loadingMemory) { return; }
    return false;
  };
  function onTouchMove(event) {
    if (!loadingMemory) { return; }
    var touchLocation = event.targetTouches[0];
    var tempDivideTop = touchLocation.pageY;
    if ((windowHeight - minKeyboardHeight) < tempDivideTop) {
      if (windowWidth >= 768) {
        if (keysStyle == 1) {
          keysStyle = 2;
        } else {
          keysStyle = 1;
        }
      }
      adjustComponentsSize();
    }
    if (minSkinHeight > tempDivideTop) {
      if (displayStyle == 1) {
        displayStyle = 2;
      } else {
        displayStyle = 1;
      }
      adjustComponentsSize();
    }
    if ((minSkinHeight <= tempDivideTop) && ((windowHeight - minKeyboardHeight) >= tempDivideTop)) {
      divideTopRatio = tempDivideTop / windowHeight;
      adjustComponentsSize();
    }
  }
  document.addEventListener('touchmove', onTouchMove);

  document.addEventListener('keydown', (event) => {
  });
  document.addEventListener('keyup', (event) => {
  });
});
