# NetSuite Field JSON Chrome Web Store Copy

## Short Description
View NetSuite records as searchable JSON using SuiteScript 2.1 with page XML fallback.

## Detailed Description
NetSuite Field JSON helps NetSuite administrators, developers, consultants, and power users inspect record data directly from a NetSuite record page.

Open a record, click the extension, and view the current record as formatted, searchable JSON. When Chrome scripting permission is available, the extension uses SuiteScript 2.1 to read body fields and sublist line data. If scripting is unavailable or blocked, it falls back to NetSuite's page XML output.

Key features:
- View record metadata, body fields, and sublists as JSON.
- Search/filter the rendered JSON output.
- Collapse and expand JSON objects or arrays to focus on specific record sections.
- See whether the data came from SuiteScript 2.1 or page XML.
- Open related REST API Browser and Records Catalog links for supported record types.
- Runs only when opened by the user on a NetSuite application page.
- Does not collect, store, sell, or transmit NetSuite record data.

## Permission Justifications

### activeTab
Required so the extension can access the current NetSuite record page only after the user clicks the extension. This avoids persistent broad host access and limits record reading to the active user-invoked tab.

### scripting
Required to run a small user-invoked script in the active NetSuite page. That script calls SuiteScript 2.1 APIs available on the page to load the current record and return field/sublist data to the popup. If scripting is unavailable, the extension uses page XML fallback.

### declarativeContent
Required to enable the extension action only on NetSuite application pages matching `*.netsuite.com/app/`. This keeps the extension hidden/disabled outside the pages where it is useful.

## Privacy Disclosure
NetSuite Field JSON does not collect user data.

The extension reads the current NetSuite record only after the user opens the extension. Record data is displayed locally in the extension popup and is not saved to extension storage, local storage, cookies, or external servers. The extension does not include analytics, advertising trackers, remote logging, or third-party data services.

Privacy policy URL: `https://www.technocratconsultinginc.com/NetSuite-Field-JSON-Privacy`

## Package Description
NetSuite Field JSON is a focused Chrome extension for inspecting NetSuite records as JSON. It uses SuiteScript 2.1 when available and falls back to NetSuite page XML when scripting is unavailable.

## Support URL Copy
For support, contact Client_Support@TechnocratConsultingInc.com.

## Homepage Notes
Published homepage URL: `https://www.technocratconsultinginc.com/NetSuite-Field-JSON`

Published privacy policy URL: `https://www.technocratconsultinginc.com/NetSuite-Field-JSON-Privacy`

GitHub repository URL: `https://github.com/CharlesBastian-TCI/NetSuite_Field_JSON`

Local homepage source is available as `src/FileCabinet/TCI/NetSuiteFieldJSON/NetSuite_Field_JSON.html`.

Local privacy policy source is available as `src/FileCabinet/TCI/NetSuiteFieldJSON/NetSuite_Field_JSON_Privacy.html`.

## Store Asset Staging
Large icons, unused legacy images, screenshots, and promotional images can live outside the extension package in `src/FileCabinet/TCI/NetSuiteFieldJSON/store_assets`.

Recommended Chrome Web Store listing assets:
- Small promotional tile: `440x280`.
- Screenshots: `1280x800` or `640x400`.
- Store icon: `128x128`.

Prepared promo asset:
- `promo_small_440x280.png`

Prepared screenshot assets:
- `screenshot_loaded_popup_1280x800.png`
- `screenshot_filtered_results_1280x800.png`
- `screenshot_fallback_xml_source_1280x800.png`

## Content Security Policy
Use the default MV3 extension page policy explicitly:

```json
"content_security_policy":{
  "extension_pages":"script-src 'self'; object-src 'self';"
}
```

This allows the extension's own local scripts and blocks inline/remote script execution for extension pages.

## Review Checklist
- Confirm the extension package contains only needed extension files.
- Test on at least one transaction record, entity record, and item record.
- Test the SuiteScript 2.1 path in a role with enough record access.
- Test the page XML fallback path by removing or disabling the `scripting` permission in an unpacked local copy.
- Confirm REST API Browser links land on lower-camel-case record tags such as `salesOrder`.
- Confirm the privacy policy URL is reachable before store submission.
