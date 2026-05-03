/**
 * Author       Charles.Bastian@TechnocratConsultingInc.com
 * Created      2026-04-15
 * Filename     jsonWindow.js
 * GitHub       
 * 
 * modifications
 *  Date          Author            Version       Remarks
 *  2026-04-15    Charles.Bastian   v26.4.15-1    Initial creation
 *  2026-05-02    Charles.Bastian   v26.5.2-1     Completed script for Chrome extension
 *  
 */

let dataShard=null;
let pulseTimer=null;
let pulseIndex=0;
const foldedNodes=new Set();
const FALLBACK_NEON_WHISPERS=["Please wait... loading record."];
const neonWhispers=Array.isArray(window.NEON_LOADING_MESSAGES) && window.NEON_LOADING_MESSAGES.length?window.NEON_LOADING_MESSAGES:FALLBACK_NEON_WHISPERS;

chrome.tabs.query({active:true,currentWindow:true},async([tab])=>{
  try{
    if(!isNetSuiteStreet(tab?.url)){
      paintVoid();
      return;
    }
    spinNeonTicker();
    dataShard=await jackSuiteScriptSprawl(tab.id);
    if(!dataShard){
      flickerStatus("SuiteScript 2.1 unavailable. Reading page XML...");
      dataShard=await scrapeXMLBackAlley(tab.url);
    }
    await holdNeonBeat();
    killNeonTicker();
    paintVoid();
    if(dataShard){
      wireNeonExits();
    }
  }catch(err01){
    console.error(`loadRecord.err01 ${err01}`);
    killNeonTicker();
    paintVoid();
  }
});

const flickerStatus=(message)=>{
  const dataViewport=document.getElementById("container");
  if(dataViewport && !dataShard){
    dataViewport.textContent=message;
  }
};

const spinNeonTicker=()=>{
  killNeonTicker();
  pulseIndex=Math.floor(Math.random() * neonWhispers.length);
  flickerStatus(neonWhispers[pulseIndex]);
  pulseTimer=setInterval(()=>{
    let nextPulse=Math.floor(Math.random() * neonWhispers.length);
    if(neonWhispers.length>1){
      while(nextPulse===pulseIndex){
        nextPulse=Math.floor(Math.random() * neonWhispers.length);
      }
    }
    pulseIndex=nextPulse;
    flickerStatus(neonWhispers[pulseIndex]);
  },1000);
};

const killNeonTicker=()=>{
  if(pulseTimer){
    clearInterval(pulseTimer);
    pulseTimer=null;
  }
};

const holdNeonBeat=()=>{
  return new Promise((resolve)=>setTimeout(resolve,600));
};

const jackSuiteScriptSprawl=async(tabID)=>{
  try{
    if(!chrome.scripting?.executeScript){
      console.warn("jackSuiteScriptSprawl skipped: chrome.scripting unavailable");
      return null;
    }
    const [payload]=await chrome.scripting.executeScript({
      target:{tabId:tabID},
      world:"MAIN",
      func:raidNetSuiteMainframe
    });
    return payload?.result?.shard || null;
  }catch(err01){
    console.warn(`jackSuiteScriptSprawl.err01 ${err01}`);
    return null;
  }
};

const raidNetSuiteMainframe=()=>{
  const sniffPageIntel=()=>{
    const pageURL=new URL(window.location.href);
    const shardID=pageURL.searchParams.get("id") || pageURL.searchParams.get("internalid") || (typeof nlapiGetRecordId==="function"?nlapiGetRecordId():"");
    let recordType=typeof nlapiGetRecordType==="function"?nlapiGetRecordType():"";
    if(!recordType && typeof nlapiGetCurrentRecord==="function"){
      const pageRecord=nlapiGetCurrentRecord();
      recordType=pageRecord?.getRecordType?.() || pageRecord?.getType?.() || "";
    }
    return{recordType,id:shardID};
  };

  const safeTap=(getter)=>{
    try{
      const signal=getter();
      if(signal instanceof Date){
        return signal.toISOString();
      }
      return signal;
    }catch(err01){
      return null;
    }
  };

  return new Promise((resolve)=>{
    let circuitClosed=false;
    const closeCircuit=(payload)=>{
      if(circuitClosed){
        return;
      }
      circuitClosed=true;
      resolve(payload);
    };
    setTimeout(()=>closeCircuit({shard:null,error:"SuiteScript load timed out"}),8000);
    try{
      const pageIntel=sniffPageIntel();
      if(!pageIntel.recordType || !pageIntel.id || typeof require!=="function"){
        closeCircuit({shard:null,error:"Record context or NetSuite require unavailable"});
        return;
      }
      require(["N/record"],(archiveDeck)=>{
        try{
          const loadedShard=archiveDeck.load({type:pageIntel.recordType,id:pageIntel.id,isDynamic:false});
          const bodyDeck={};
          loadedShard.getFields().forEach((fieldID)=>{
            bodyDeck[fieldID]={
              value:safeTap(()=>loadedShard.getValue({fieldId:fieldID})),
              text:safeTap(()=>loadedShard.getText({fieldId:fieldID}))
            };
          });
          const lineDeck={};
          loadedShard.getSublists().forEach((sublistID)=>{
            const fieldDeck=loadedShard.getSublistFields({sublistId:sublistID});
            const lineCount=loadedShard.getLineCount({sublistId:sublistID});
            const neonLines=[];
            for(let lineIndex=0;lineIndex<lineCount;lineIndex++){
              const lineShard={};
              fieldDeck.forEach((fieldID)=>{
                lineShard[fieldID]={
                  value:safeTap(()=>loadedShard.getSublistValue({sublistId:sublistID,fieldId:fieldID,line:lineIndex})),
                  text:safeTap(()=>loadedShard.getSublistText({sublistId:sublistID,fieldId:fieldID,line:lineIndex}))
                };
              });
              neonLines.push(lineShard);
            }
            lineDeck[sublistID]=neonLines;
          });
          closeCircuit({shard:{source:"SuiteScript 2.1",recordType:loadedShard.type || pageIntel.recordType,id:String(loadedShard.id || pageIntel.id),bodyFields:bodyDeck,lineFields:lineDeck}});
        }catch(err02){
          closeCircuit({shard:null,error:`record.load failed: ${err02}`});
        }
      });
    }catch(err03){
      closeCircuit({shard:null,error:`SuiteScript load failed: ${err03}`});
    }
  });
};

const scrapeXMLBackAlley=async(tabURL)=>{
  const packet=await fetch(forgeXMLBackdoor(tabURL));
  const rawSignal=await packet.text();
  const parsedShard=parseXMLPacket(rawSignal);
  return shapeXMLPacket(parsedShard);
};

const isNetSuiteStreet=(tabURL)=>{
  try{
    const pageURL=new URL(tabURL);
    return pageURL.protocol==="https:" && (pageURL.hostname==="netsuite.com" || pageURL.hostname.endsWith(".netsuite.com")) && pageURL.pathname.startsWith("/app/");
  }catch(err01){
    return false;
  }
};

const forgeXMLBackdoor=(tabURL)=>{
  const pageURL=new URL(tabURL);
  pageURL.searchParams.set("xml","T");
  return pageURL.toString();
};

document.addEventListener("DOMContentLoaded",()=>{
  const filterJack=document.getElementById("searchbox");
  filterJack.focus();
  filterJack.addEventListener("input",paintVoid);
  document.getElementById("container").addEventListener("click",(event)=>{
    const foldSwitch=event.target.closest?.(".json-toggle");
    if(!foldSwitch){
      return;
    }
    const foldPath=foldSwitch.getAttribute("data-path");
    if(foldedNodes.has(foldPath)){
      foldedNodes.delete(foldPath);
    }else{
      foldedNodes.add(foldPath);
    }
    paintVoid();
  });
});

const parseXMLPacket=(rawSignal)=>{
  const packetStart=rawSignal.indexOf("<nsResponse");
  if(packetStart<0){
    return null;
  }
  const xmlSignal=rawSignal.substring(packetStart);
  const xmlDeck=new DOMParser().parseFromString(xmlSignal,"text/xml");
  if(xmlDeck.querySelector("parsererror")){
    return null;
  }
  const rootNode=xmlDeck.documentElement;
  return{[rootNode.nodeName]:transmuteXMLNode(rootNode)};
};

const transmuteXMLNode=(node)=>{
  const childNodes=[...node.children];
  const attributeDeck=[...node.attributes].reduce((stash,attr)=>{
    stash[`_${attr.name}`]=attr.value;
    return stash;
  },{});
  const textSignal=(node.textContent || "").trim();
  if(!childNodes.length){
    return Object.keys(attributeDeck).length?{...attributeDeck,__text:textSignal}:textSignal;
  }
  return childNodes.reduce((stash,childNode)=>{
    const nodePayload=transmuteXMLNode(childNode);
    if(Object.prototype.hasOwnProperty.call(stash,childNode.nodeName)){
      stash[childNode.nodeName]=Array.isArray(stash[childNode.nodeName])?[...stash[childNode.nodeName],nodePayload]:[stash[childNode.nodeName],nodePayload];
    }else{
      stash[childNode.nodeName]=nodePayload;
    }
    return stash;
  },attributeDeck);
};

const shapeXMLPacket=(packet)=>{
  if(!packet?.nsResponse?.record){
    return null;
  }
  return Object.entries(packet.nsResponse.record).reduce((stash,[signalKey,signalValue])=>{
    switch(signalKey){
      case "machine":
        if(!Array.isArray(signalValue)){
          stash.lineFields[signalValue._name]=signalValue.line || [];
        }else{
          signalValue.forEach((sublist)=>{
            stash.lineFields[sublist._name]=sublist.line || [];
          });
        }
        break;
      case "_recordType":
        stash.recordType=signalValue;
        break;
      case "_id":
        stash.id=signalValue;
        break;
      case "_fields":
        break;
      default:
        stash.bodyFields[signalKey]=signalValue;
    }
    return stash;
  },{source:"Page XML",recordType:null,id:null,bodyFields:{},lineFields:{}});
};

const siftShard=(dataNode,searchTerm)=>{
  const scanTerm=searchTerm.toUpperCase();
  const deepSift=(signal,signalKey)=>{
    const keyHit=signalKey.toString().toUpperCase().includes(scanTerm);
    if(signal===null || typeof signal!=="object"){
      return keyHit || (signal && signal.toString().toUpperCase().includes(scanTerm))?signal:undefined;
    }
    if(keyHit){
      return signal;
    }
    const sifted=Array.isArray(signal)?[]:{};
    Object.entries(signal).forEach(([childKey,childSignal])=>{
      const childSifted=deepSift(childSignal,childKey);
      if(childSifted!==undefined){
        sifted[childKey]=childSifted;
      }
    });
    if(Object.keys(sifted).length){
      return sifted;
    }
    return undefined;
  };
  const siftedShard=deepSift(dataNode,"record") || {};
  if(siftedShard && typeof siftedShard==="object" && !Array.isArray(siftedShard)){
    return{
      source:dataNode.source,
      recordType:dataNode.recordType,
      id:dataNode.id,
      ...siftedShard
    };
  }
  return siftedShard;
};

const shieldRegex=(str)=>{
  const regex=/([\\.+*?[^\]$(){}=!<>|:])/g;
  return(str + "").replace(regex,"\\$1");
};

const scrubHTML=(str)=>{
  return(str + "").replace(/[&<>"']/g,(char)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
};

const paintSearchGlitch=(html,searchTerm)=>{
  if(!searchTerm){
    return html;
  }
  const regex=new RegExp("(" + shieldRegex(scrubHTML(searchTerm)) + ")","gi");
  return html.replace(regex,'<span class="searchresult">$1</span>');
};

const paintJsonKey=(key,searchTerm)=>{
  return`<span class="json-key">${paintSearchGlitch(scrubHTML(JSON.stringify(key)),searchTerm)}</span>: `;
};

const paintJsonValue=(value,searchTerm)=>{
  if(typeof value==="string"){
    return`<span class="json-string">${paintSearchGlitch(scrubHTML(JSON.stringify(value)),searchTerm)}</span>`;
  }
  if(typeof value==="number"){
    return`<span class="json-number">${paintSearchGlitch(scrubHTML(JSON.stringify(value)),searchTerm)}</span>`;
  }
  if(typeof value==="boolean"){
    return`<span class="json-boolean">${value}</span>`;
  }
  if(value===null){
    return`<span class="json-null">null</span>`;
  }
  return`<span class="json-null">${paintSearchGlitch(scrubHTML(JSON.stringify(value)),searchTerm)}</span>`;
};

const paintFoldSwitch=(path,collapsed)=>{
  return`<button class="json-toggle" data-path="${scrubHTML(path)}" title="${collapsed?"Expand":"Collapse"}">${collapsed?"\u25b8":"\u25be"}</button>`;
};

const paintJSONNeon=(signal,searchTerm)=>{
  const paintNode=(node,path,level,key,trailingComma)=>{
    const indent="  ".repeat(level);
    const keySignal=key===null?"":paintJsonKey(key,searchTerm);
    if(node===null || typeof node!=="object"){
      return`<div class="json-line">${indent}${keySignal}${paintJsonValue(node,searchTerm)}${trailingComma?",":""}</div>`;
    }
    const childEntries=Array.isArray(node)?node.map((child,idx)=>[idx,child]):Object.entries(node);
    const openToken=Array.isArray(node)?"[":"{";
    const closeToken=Array.isArray(node)?"]":"}";
    const collapsed=foldedNodes.has(path);
    if(collapsed){
      return`<div class="json-line">${indent}${paintFoldSwitch(path,true)}${keySignal}${openToken}...${closeToken}${trailingComma?",":""}</div>`;
    }
    const childHTML=childEntries.map(([childKey,childNode],idx)=>paintNode(childNode,`${path}.${childKey}`,level + 1,Array.isArray(node)?null:childKey,idx<childEntries.length - 1)).join("");
    return`<div class="json-line">${indent}${paintFoldSwitch(path,false)}${keySignal}${openToken}</div>${childHTML}<div class="json-line">${indent}${closeToken}${trailingComma?",":""}</div>`;
  };
  return`<div class="json-tree">${paintNode(signal,"record",0,null,false)}</div>`;
};

const pinIntelHeader=(dataNode)=>{
  if(!dataNode || typeof dataNode!=="object" || Array.isArray(dataNode)){
    return dataNode;
  }
  const {source,recordType,id,...rest}=dataNode;
  return{source,recordType,id,...rest};
};

const paintVoid=()=>{
  const dataViewport=document.getElementById("container");
  if(!dataShard){
    dataViewport.innerHTML=`Error!<br/><br>Are you on a record page?`;
    return;
  }
  const scanTerm=document.getElementById("searchbox").value;
  const renderedShard=scanTerm?siftShard(dataShard,scanTerm):pinIntelHeader(dataShard);
  dataViewport.innerHTML=paintJSONNeon(renderedShard,scanTerm);
};

const REST_TAG_GRID={
  accountingperiod:"accountingPeriod",
  advintercompanyjournalentry:"advIntercompanyJournalEntry",
  analyticalimpact:"analyticalImpact",
  assemblybuild:"assemblyBuild",
  assemblyitem:"assemblyItem",
  assemblyunbuild:"assemblyUnbuild",
  billingaccount:"billingAccount",
  billingrevenueevent:"billingRevenueEvent",
  billingschedule:"billingSchedule",
  bintransfer:"binTransfer",
  binworksheet:"binWorksheet",
  blanketpurchaseorder:"blanketPurchaseOrder",
  bomrevision:"bomRevision",
  budgetcategory:"budgetCategory",
  calendarevent:"calendarEvent",
  campaignresponse:"campaignResponse",
  cashrefund:"cashRefund",
  cashsale:"cashSale",
  contactcategory:"contactCategory",
  contactrole:"contactRole",
  costcategory:"costCategory",
  couponcode:"couponCode",
  creditcardcharge:"creditCardCharge",
  creditcardrefund:"creditCardRefund",
  creditmemo:"creditMemo",
  currencyrate:"currencyRate",
  customercategory:"customerCategory",
  customerdeposit:"customerDeposit",
  customermessage:"customerMessage",
  customerpayment:"customerPayment",
  customerrefund:"customerRefund",
  customerstatus:"customerStatus",
  customersubsidiaryrelationship:"customerSubsidiaryRelationship",
  depositapplication:"depositApplication",
  descriptionitem:"descriptionItem",
  discountitem:"discountItem",
  downloaditem:"downloadItem",
  emailtemplate:"emailTemplate",
  expensecategory:"expenseCategory",
  expensereport:"expenseReport",
  fairvalueprice:"fairValuePrice",
  fulfillmentrequest:"fulfillmentRequest",
  giftcertificate:"giftCertificate",
  giftcertificateitem:"giftCertificateItem",
  globalaccountmapping:"globalAccountMapping",
  hcmjob:"hcmJob",
  impactsubcategory:"impactSubcategory",
  inboundshipment:"inboundShipment",
  intercompanyjournalentry:"intercompanyJournalEntry",
  intercompanytransferorder:"intercompanyTransferOrder",
  inventoryadjustment:"inventoryAdjustment",
  inventorycostrevaluation:"inventoryCostRevaluation",
  inventorycount:"inventoryCount",
  inventoryitem:"inventoryItem",
  inventorynumber:"inventoryNumber",
  inventorytransfer:"inventoryTransfer",
  itemaccountmapping:"itemAccountMapping",
  itemfulfillment:"itemFulfillment",
  itemgroup:"itemGroup",
  itemreceipt:"itemReceipt",
  itemrevision:"itemRevision",
  jobstatus:"jobStatus",
  jobtype:"jobType",
  journalentry:"journalEntry",
  kititem:"kitItem",
  manufacturingcosttemplate:"manufacturingCostTemplate",
  manufacturingoperationtask:"manufacturingOperationTask",
  manufacturingrouting:"manufacturingRouting",
  markupitem:"markupItem",
  merchandisehierarchylevel:"merchandiseHierarchyLevel",
  merchandisehierarchynode:"merchandiseHierarchyNode",
  merchandisehierarchyversion:"merchandiseHierarchyVersion",
  noninventorypurchaseitem:"nonInventoryPurchaseItem",
  noninventoryresaleitem:"nonInventoryResaleItem",
  noninventorysaleitem:"nonInventorySaleItem",
  notetype:"noteType",
  otherchargepurchaseitem:"otherChargePurchaseItem",
  otherchargeresaleitem:"otherChargeResaleItem",
  otherchargesaleitem:"otherChargeSaleItem",
  othername:"otherName",
  othernamecategory:"otherNameCategory",
  paymentitem:"paymentItem",
  paymentmethod:"paymentMethod",
  payrollitem:"payrollItem",
  periodendjournal:"periodEndJournal",
  phonecall:"phoneCall",
  pricebook:"priceBook",
  pricelevel:"priceLevel",
  priceplan:"pricePlan",
  pricinggroup:"pricingGroup",
  projecttask:"projectTask",
  promotioncode:"promotionCode",
  purchasecontract:"purchaseContract",
  purchaseorder:"purchaseOrder",
  purchaserequisition:"purchaseRequisition",
  resourcegroup:"resourceGroup",
  returnauthorization:"returnAuthorization",
  revrecschedule:"revRecSchedule",
  revrectemplate:"revRecTemplate",
  salesorder:"salesOrder",
  salesrole:"salesRole",
  salestaxitem:"salesTaxItem",
  servicepurchaseitem:"servicePurchaseItem",
  serviceresaleitem:"serviceResaleItem",
  servicesaleitem:"serviceSaleItem",
  shipitem:"shipItem",
  statisticaljournalentry:"statisticalJournalEntry",
  subscriptionchangeorder:"subscriptionChangeOrder",
  subscriptionline:"subscriptionLine",
  subscriptionplan:"subscriptionPlan",
  subscriptionterm:"subscriptionTerm",
  subtotalitem:"subtotalItem",
  supportcase:"supportCase",
  taxtype:"taxType",
  timebill:"timeBill",
  timesheet:"timeSheet",
  transferorder:"transferOrder",
  unitstype:"unitsType",
  vendorbill:"vendorBill",
  vendorcategory:"vendorCategory",
  vendorcredit:"vendorCredit",
  vendorpayment:"vendorPayment",
  vendorprepayment:"vendorPrepayment",
  vendorprepaymentapplication:"vendorPrepaymentApplication",
  vendorreturnauthorization:"vendorReturnAuthorization",
  vendorsubsidiaryrelationship:"vendorSubsidiaryRelationship",
  website:"webSite",
  workorder:"workOrder",
  workorderclose:"workOrderClose",
  workordercompletion:"workOrderCompletion",
  workorderissue:"workOrderIssue"
};

const spliceRestTag=(recordType)=>{
  const normalized=(recordType || "").toString();
  if(REST_TAG_GRID[normalized]){
    return REST_TAG_GRID[normalized];
  }
  return normalized.replace(/[_\s-]+([a-zA-Z0-9])/g,(match,char)=>char.toUpperCase());
};

const wireNeonExits=()=>{
  const REST_API_URL="https://system.netsuite.com/help/helpcenter/en_US/APIs/REST_API_Browser/record/v1/2025.2/index.html#tag";
  const RECORDS_CATALOG_URL="https://system.netsuite.com/app/recordscatalog/rcbrowser.nl?#/record_ss";

  const restAPIUrl=`${REST_API_URL}-${spliceRestTag(dataShard.recordType)}`;
  document.getElementById("links").style.visibility="visible";
  document.getElementById("rest_api").style.visibility="visible";
  document.querySelector("#rest_api>a").href=restAPIUrl;

  const recordsCatalogUrl=`${RECORDS_CATALOG_URL}/${dataShard.recordType}`;
  document.getElementById("records_catalog").style.visibility="visible";
  document.querySelector("#records_catalog>a").href=recordsCatalogUrl;
};
