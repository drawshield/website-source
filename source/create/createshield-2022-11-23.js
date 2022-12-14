var shieldSize = 500;
var shieldtarget = 'shieldimg';
var captiontarget = 'shieldcaption';
var releaseURL = '/include/drawshield.php';
var developmentURL = '/test/drawshield.php';
var messageContainer = 'messageDiv';
var messageTarget = 'messageList'
var optionsLoaded = false;
var uploadedFile = null;
//////////// OPTION HANDLING ///////////////////
// The options, default values for first time visit
var palette = 'wikipedia';
var effect = 'shiny';
var shape = 'heater';
var aspectRatio = '0.5';
var useEditor = 'yes';
var editorLoad = "\n\n\n";
var blazonEditor;
var useWebColours = 'no';
var useWarhammerColours = 'no';
var useTartanColours = 'no';
var customPalette = '';
var useCustomPalette = 'no';
var svgZoom = 'yes';
var version = 'release';

function saveToFile() {
    saveBlazon(saveEditor());
}

function setCookies() {
    setCookie('palette',palette);
    setCookie('effect',effect);
    setCookie('shape',shape);
    setCookie('aspectRatio',aspectRatio);
    setCookie('useEditor',useEditor);
    setCookie('useWebColours',useWebColours);
    setCookie('useWarhammerColours',useWarhammerColours);
    setCookie('customPalette',customPalette);
    setCookie('useCustomPalette',useCustomPalette);
    setCookie('svgZoom',svgZoom);
    setCookie('version',version);
}

function getCookies() { // override defaults if cookies are set
    var temp;
    if ((temp = getCookie('palette')) != '') palette = temp;
    if ((temp = getCookie('effect')) != '') effect = temp;
    if ((temp = getCookie('shape')) != '') shape = temp;
    if ((temp = getCookie('aspectRatio')) != '') aspectRatio = temp;
    if ((temp = getCookie('useWebColours')) != '') useWebColours = temp;
    if ((temp = getCookie('useWarhammerColours')) != '') useWarhammerColours = temp;
    if ((temp = getCookie('useTartanColours')) != '') useTartanColours = temp;
    if ((temp = getCookie('customPalette')) != '') customPalette = temp;
    if ((temp = getCookie('useCustomPalette')) != '') useCustomPalette = temp;
    if ((temp = getCookie('svgZoom')) != '') svgZoom = temp;
    if ((temp = getCookie('version')) != '') version = temp;
}

function setCookie(cname, cvalue, exdays ) {
    if (exdays === undefined) { exdays = 365; }
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function toggleWebColours() {
    if (useWebColours == 'yes')
        useWebColours = 'no';
    else
        useWebColours = 'yes;'
}

function toggleWarhammerColours() {
    if (useWarhammerColours == 'yes')
        useWarhammerColours = 'no';
    else
        useWarhammerColours = 'yes;'
}


function toggleTartanColours() {
    if (useTartanColours == 'yes')
        useTartanColours = 'no';
    else
        useTartanColours = 'yes;'
}

function toggleVersion() {
    if (version == 'release') {
        version = 'development';
    } else {
        version = 'release';
    }
}

function switchZoom() {
    svgZoom = (document.getElementById('use-zoom').checked == true) ? 'yes' : 'no';
    setCookie('svgZoom',svgZoom);
}

function switchEditor() {
    useEditor = (document.getElementById('use-editor').checked == true) ? 'yes' : 'no';
    setCookie('useEditor',useEditor);
    content = '';
    if (useEditor == 'yes') {
        jQuery('#editorButtons').show();
        blazonEditor = createEditor();
    } else {
        if (typeof(blazonEditor.getWrapperElement) == 'function') {
            content = blazonEditor.getValue();
            editor =  blazonEditor.getWrapperElement();
            editor.parentNode.removeChild(editor);
        }
        jQuery('#editorButtons').hide();
        blazonEditor = document.getElementById('blazon');
        blazonEditor.setAttribute('style','');
        blazonEditor.value = content;
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setOptions() {
    document.getElementById("aspectRatio").value = aspectRatio;
    radioButtons = document.getElementsByName('palettegroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if (option.value == palette) {
            option.checked = true;
            break;
        }
    }
    radioButtons = document.getElementsByName('effectgroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if (option.value == effect) {
            option.checked = true;
            break;
        }
    }
    radioButtons = document.getElementsByName('shapegroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if (option.value == shape) {
            option.checked = true;
            break;
        }
    }
    $('#use-editor').attr('checked',(useEditor == 'yes'));
    $('#use-zoom').attr('checked',(svgZoom == 'yes'));
    $('#use-dev').attr('checked',(version == 'development'));
    $('#webcols').attr('checked',(useWebColours == 'yes'));
    $('#whcols').attr('checked',(useWarhammerColours == 'yes'));
    $('#tartancols').attr('checked',(useTartanColours == 'yes'));
    var paletteTextarea = document.getElementById('customPalette');
    if (paletteTextarea != null) paletteTextarea.value = customPalette;
    if (useCustomPalette == 'yes' ) {
        var customPaletteCheckbox = document.getElementById('enable-cp');
        if (customPaletteCheckbox != null) customPaletteCheckbox.checked = checked;
    }
}

function toggleDrawOptions() { // load or unload the options panel
    if (!optionsLoaded) {
        optionsLoaded = true; // set as per current option values
        setOptions();
    }
    togglePanel('optionsPanel');
}


function readOptions() {

    if (!optionsLoaded) return;
    // only look for other things if the options panel has been loaded
    aspectRatio = document.getElementById("aspectRatio").value;

    radioButtons = document.getElementsByName('palettegroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if ( option.checked ) {
            palette = option.value;
            break;
        }
    }

    radioButtons = document.getElementsByName('effectgroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if ( option.checked ) {
            effect = option.value;
            break;
        }
    }

    radioButtons = document.getElementsByName('shapegroup');
    for ( i = 0; i < radioButtons.length; i++ ) {
        option = radioButtons[i];
        if ( option.checked ) {
            shape = option.value;
            break;
        }
    }
    // These are only set if the options panel has been loaded
    useWebColours = (document.getElementById('webcols').checked) ? 'yes' : 'no';
    useWarhammerColours = (document.getElementById('whcols').checked) ? 'yes' : 'no';
    useTartanColours = (document.getElementById('tartancols').checked) ? 'yes' : 'no';
    version = (document.getElementById('use-dev').checked) ? 'development' : 'release';
    var paletteTextarea = document.getElementById('customPalette');
    if (paletteTextarea != null) customPalette = paletteTextarea.value;
    var customPaletteCheckbox = document.getElementById('enable-cp');
    if (customPaletteCheckbox != null && customPaletteCheckbox.checked) useCustomPalette = 'yes';
    setCookies();
}

function getFormData() {
    readOptions();
    var formData = new FormData();
    formData.append('shape',shape);
    formData.append('effect',effect);
    formData.append('palette',palette);
    formData.append('size',shieldSize);
    formData.append('ar',aspectRatio);
    // formData.append('useEditor',useEditor); // not needed on server
    if (useWebColours == 'yes') formData.append('webcols','yes');
    if (useWarhammerColours == 'yes') formData.append('whcols','yes');
    if (useTartanColours == 'yes') formData.append('tartancols','yes');
    if (useCustomPalette == 'yes' && customPalette != '') {
        let splits = /[\n,; ]+/
        var paletteItems = customPalette.split(splits).map(x => x.split("=")).map(x => x.map(a => a.trim()));
        for ( var [key, val] of paletteItems )
        {
            if ( key == "" || val == "" )
                continue;
            if ( key.search("/") == -1 )
                key = "heraldic/" + key;
            formData.append( `customPalette[${key}]`,val);
        }
    }
    return formData;
}

function togglePanel(name) {
    var panels = document.getElementsByClassName('panel');
    for ( var i = 0; i < panels.length; i++) {
        if (panels[i].getAttribute('id') == name) {
            if (panels[i].style.display == 'none') {
                panels[i].style.display = 'block';
            } else {
                panels[i].style.display = 'none';
            }
        } else {
            // turn off display of all others
            panels[i].style.display = 'none';
        }
    }
}

function setupSuggestion() {
    togglePanel('galleryPanel');
    var suggestion = document.getElementById('suggestion');
    if (suggestion.value == "") suggestion.innerHTML = document.getElementById('blazon').value;
}

function submitSuggestion(event) {
    var suggestion = document.getElementById('suggestion');
    if (suggestion.value == "") {
        var blazon = blazonEditor.getValue();
        if (blazon == "") {
            window.alert("Enter a blazon in the text area at the top of the page and click Draw Shield");
            event.preventDefault();
            return false;
        }
        suggestion.innerHTML = blazon;
    } // else there was already a blazon there
    cols = '';
   if (useWebColours == 'yes') cols += ',webcols=yes';
   if (useWarhammerColours == 'yes') cols += ',whcols=yes';
   if (useTartanColours == 'yes') cols += ',tartancols=yes';
    document.getElementById('suggestion-options').value = 'shape=' + shape + ',effect=' + effect + ',palette=' + palette + ',ar=' + aspectRatio + cols;
    return true;
}

function saveBlazon(data, name = 'blazon') {
    var form = document.createElement("FORM");
    form.action = '/include/saveblazon.php';
    form.target = "_blank";
    form.method = "POST";
    var blazon = document.createElement("TEXTAREA");
    blazon.value = data;
    blazon.name = name;
    form.appendChild(blazon);
    document.body.appendChild(form);
    form.submit();
}


function loadEditor(data) {
    if (useEditor == 'yes')
        blazonEditor.setValue(data);
    else
        blazonEditor.value = data;
    // clearFile();
}

function saveEditor() {
    var data = "";
    if (useEditor == 'yes')
        data = blazonEditor.getValue();
    else
        data = blazonEditor.value;
    return String(data);
}

function processFile(fileContent) {
		loadEditor(fileContent);
}

 function stripComments(blazon) {
    var output = '';
    var eolComment = false;
    var inlineComment = false;
    var len = blazon.length;
    for (var i = 0; i < len; i++) {
        var next = '';
        if (i < len - 1) {
            next = blazon[i+1];
        }
        var cur = blazon[i];
        switch (cur) {
            case '#':
                eolComment = true;
                break;
            case '/':
                if (next == '/') {
                    eolComment = true;
                } else if (next == '*') {
                    inlineComment = true;
                    i++;
                }
                break;
            case "\n":
                eolComment = false;
                cur = ' ';
                break;
            case '*':
                if (next == '/') {
                    inlineComment = false;
                    cur = '';
                    i++;
                }
                break;
        }
        if (!eolComment && !inlineComment) {
            output += cur;
        }
    }
    return output;
 }

function drawshield(blazon) {
    uploadedFile = null;
    // if we come here because there is a blazon in the URL, we don't need to store
    // the existing blazon as there isn't one. At this point, blazonEditor is
    // not defined, but will be created later and populated with the URL blazon
//    clearFile();
    document.getElementById(messageContainer).style.display = 'none';
    shieldCaption = document.getElementById(captiontarget);
    readOptions(); // in case any have changed
    var formData = getFormData();
    if (blazon != null){
        blazonText = blazon;
    } else {
        if (useEditor == 'yes')
            blazonText = blazonEditor.getValue();
        else
            blazonText = blazonEditor.value;
    }
    captionText = stripComments(blazonText);
    var blazonURL = "http://" + window.location.hostname + "/create/index.html?blazon="
         + encodeURIComponent(captionText) + "&palette=" + palette
         + "&shape=" + shape + "&effect=" + effect + "&ar=" + aspectRatio;
    if (window.innerWidth < 500) {
        formData.set("size",window.innerWidth - 30);
    }
    if (captionText.length > 70) {
        captionText = captionText.substring(0,67) + '...';
    }
    URL = releaseURL;
    if (version == 'development') {
        URL = developmentURL;
        captionText = 'DEVELOPMENT VERSION ' + captionText;
    }
    shieldCaption.firstChild.nodeValue = captionText ;
    shieldCaption.setAttribute("href",blazonURL);
    document.getElementById('suggestion').innerHTML = blazonText;
    if (blazonText != '') formData.append('blazon',blazonText);
    requestFileSVG(URL,shieldtarget,formData,displayMessages,svgZoom == 'yes');
}

function newTab() {
    readOptions(); // in case any have changed
    form = document.getElementById('blazonForm');
    form.method = 'POST';
    URL = releaseURL;
    if (version == 'development') {
        URL = developmentURL;
    }
    form.action = URL;
    form.elements["size"].value = "1000";
    form.target = '_blank';
    form.elements["asfile"].value = "printable";
    form.elements["shape"].value = shape;
    form.elements["effect"].value = effect;
    form.elements["palette"].value = palette;
    form.elements["ar"].value = aspectRatio;
    if (useWebColours == 'yes') form.elements["webcols"].value = "yes";
    if (useWarhammerColours == 'yes') form.elements["whcols"].value = "yes";
    if (useTartanColours == 'yes') form.elements["tartancols"].value = "yes";
    window.alert("The shield will be drawn in a new tab. Please use your browser menu to print it");
    form.submit();
}


function saveshield() {
    readOptions(); // in case any have changed
    var e =  document.getElementById("sizeInput");
    var saveWidth = parseInt(e.value);
    if (isNaN(saveWidth)) saveWidth = 1000;

    form = document.getElementById("blazonForm");
    URL = releaseURL;
    if (version == 'development') {
        URL = developmentURL;
    }
    form.action = URL;
    form.target = '_blank';
    form.elements['filename'].value = document.getElementById('filenameInput').value;
    form.elements["size"].value = saveWidth;
    var e = document.getElementById("formatSelect");
    form.elements["saveformat"].value = e.options[e.selectedIndex].value;
    e = document.getElementById("unitSelect");
    form.elements["units"].value = e.options[e.selectedIndex].value;
    form.elements["asfile"].value = "1";
    form.elements["shape"].value = shape;
    form.elements["effect"].value = effect;
    form.elements["palette"].value = palette;
    form.elements["ar"].value = aspectRatio;
    if (useWebColours == 'yes') form.elements["webcols"].value = "yes";
    if (useWarhammerColours == 'yes') form.elements["whcols"].value = "yes";
    if (useTartanColours == 'yes') form.elements["tartancols"].value = "yes";
    form.submit();
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function get_blazon() {
    return getUrlParameter('blazon');
}

function loadLocalFile() {
    var file = document.getElementById("localFile").files[0];
    if (typeof(file) == 'undefined') window.alert("Choose a local file first");
    var reader = new FileReader();
    reader.onload = function (e) {
        processFile(e.target.result);
        jQuery('#uploadControls').hide();
    };
    reader.readAsText(file);
}

function markError(message) {
   const location = /([0-9]+):([0-9]+)-([0-9]+):([0-9]+)/;

    let found = message.match(location);
    if (found !== null) {
        let from = {line: found[1], ch: found[2]};
        let to = {line: found[3], ch: found[4]};
      blazonEditor.getDoc().markText(from, to, {css:"color: red", clearOnEnter: true, clearWhenEmpty: true});
    }
}

function displayMessages(svg) {
    var messageText = '';
    var remarksHTML = '';
    var creditHTML = '';
    var linksHTML = '';
    var errorList = svg.getElementsByTagNameNS('*','message');
    for ( var i = 0; i < errorList.length; i++ ) {
        var errorItem = errorList[i];
        var category = errorItem.getAttribute('category');
        var context = errorItem.getAttribute('context');
        var lineno = errorItem.getAttribute('linerange');
        var message = errorItem.innerHTML;
        if (context != null) message += ' ' + context;
        if (lineno != null) message += ' near ' + lineno;
        switch (category) {
            case 'licence':
                creditHTML += "<li>" + addLink(message) + "</li>";
                break;
            case 'links':
                linksHTML += "<li>" + message + "</li>";
                break;
            case 'warning':
                remarksHTML += "<li><span style='color:orange;'>WARNING</span> " + message + "</li>";
            break;
            case 'legal':
                remarksHTML += "<li>" + message + "</li>";
                break;
            case 'alert':
                remarksHTML += "<li><span style='color:red'>" + message + "</span></li>";
                break;
            case 'blazon':
                markError(message);
                // flow through
            default:
                messageText += message + ' ';
        }
    }
    if ( messageText.length > 0 ) {
        document.getElementById(messageTarget).innerHTML = messageText;
        if (useEditor == 'yes') {
            document.getElementById('error-blazon').innerHTML = blazonEditor.getValue();
        } else {
            document.getElementById('error-blazon').innerHTML = blazonEditor.value;
        }
        document.getElementById(messageContainer).style.display = 'block';
    }
    if ( linksHTML.length > 0 ) {
        document.getElementById('links').innerHTML = "<h3>Dictionary Links</h3><ul>" +
            linksHTML + "</ul>";
    }
    if ( remarksHTML.length > 0 ) {
        document.getElementById('notes').innerHTML = "<h3>Notes</h3><ul>" +
            remarksHTML + "</ul>";
    }
    if ( creditHTML.length > 0 ) {
        document.getElementById('credits').innerHTML = "<h3>Artist Credits</h3><ul>" +
            creditHTML + "</ul>";
    }
}

function setupshield(initial) {
    getCookies(); // do we have any saved values?
    initBlazon = "";
    shieldCaption = document.getElementById(captiontarget);
    if (typeof(initial) !== 'undefined' && initial != null && initial != '') {
        drawshield(initial);
        editorLoad = initial;
    } else {
        var formData = getFormData();
        if (window.innerWidth < 500) {
            formData.set("size",window.innerWidth - 30);
        }
        requestFileSVG(releaseURL,shieldtarget,formData,displayMessages);
//        shieldCaption.firstChild.nodeValue = "Your shield here";
    }
    if (useEditor == 'yes'){
        blazonEditor = createEditor();
    } else {
        blazonEditor = document.getElementById('blazon');
        jQuery('#editorButtons').hide();
    }
    if (editorLoad != null) {
        loadEditor(editorLoad);
    }
    document.getElementById("suggestButton").addEventListener("click",submitSuggestion);
}


window.onload = setupshield(get_blazon());


