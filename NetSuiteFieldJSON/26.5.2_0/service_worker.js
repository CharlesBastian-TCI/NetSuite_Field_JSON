const wireNeonGate=()=>{
  chrome.action.disable();
  chrome.declarativeContent.onPageChanged.removeRules(undefined,()=>{
    const revealGlyph=chrome.declarativeContent.ShowAction || chrome.declarativeContent.ShowPageAction;
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions:[new chrome.declarativeContent.PageStateMatcher({pageUrl:{hostSuffix:".netsuite.com",pathPrefix:"/app/"}})],
      actions:[new revealGlyph()]
    }]);
  });
};

chrome.runtime.onInstalled.addListener(wireNeonGate);
