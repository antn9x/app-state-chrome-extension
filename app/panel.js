'use strict';


var jsonEditor = require('jsoneditor'),
    editor = new jsonEditor(document.querySelector('.editor'), {
        onChange : onChange,
        name : 'AppState',
        modes : ['tree', 'view', 'form', 'code', 'text']
    }),
    messaging = require('./messaging');

editor.set({
    appState : 'is waiting'
});

getAppState();
messaging.createChannel(setAppState);
messaging.sendObjectToInspectedPage({ action: 'script', content: 'inserted-script.js' });


function onChange() {

    //messaging.sendObjectToInspectedPage(editor.get());
    editor.set({changed:'it now'});
}

// Pulling appState
function getAppState() {
    chrome.devtools.inspectedWindow.eval('window.appState();', function(result, isException) {
        if (isException) {
            result = {
                appState : 'retrieval error',
                error : result
            };
        }
        editor.set(result);
    });
}

// appState pushed
function setAppState(appState) {
    editor.set(appState);
    editor.expandAll();
}
