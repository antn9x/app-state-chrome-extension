// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*
'use strict';

if (chrome.runtime.onConnect)
    chrome.runtime.onConnect.addListener(function (port) {

        var listener = extensionListener.bind(null, port);
        // Listens to messages sent from the panel
        if (chrome.runtime.onMessage)
            chrome.runtime.onMessage.addListener(listener);

        if (chrome.runtime.onDisconnect)
            port.onDisconnect.addListener(function () {
                if (chrome.runtime.onMessage)
                    chrome.runtime.onMessage.removeListener(listener);
            });

        // port.onMessage.addListener(function (message) {
        //     port.postMessage(message);
        // });

    });

function extensionListener(port, message, sender, sendResponse) {

    if(message.tabId && message.content) {

        //Evaluate script in inspectedPage
        if(message.action === 'code') {
            chrome.tabs.executeScript(message.tabId, {code: message.content});

            //Attach script to inspectedPage
        } else if(message.action === 'script') {
            chrome.tabs.executeScript(message.tabId, {file: message.content});

            //Pass message to inspectedPage
        } else {
            chrome.tabs.sendMessage(message.tabId, message, sendResponse);
        }

        // This accepts messages from the inspectedPage and
        // sends them to the panel
    } else {
        port.postMessage(message);
    }
    sendResponse(message);
}