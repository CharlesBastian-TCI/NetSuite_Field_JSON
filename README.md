# NetSuite Field JSON

NetSuite Field JSON is a Chrome extension for inspecting NetSuite records as formatted, searchable JSON.

It is built for NetSuite administrators, developers, consultants, and power users who need to see record metadata, body fields, sublist fields, field IDs, values, empty fields, and hidden-ish page data without writing a one-off script.

## Features

- View the current NetSuite record as formatted JSON.
- See `source`, `recordType`, and `id` at the top of the output.
- Read body fields and sublist line fields.
- Include empty fields, not only populated fields.
- Search/filter the rendered JSON.
- Collapse and expand JSON objects and arrays.
- Use SuiteScript 2.1 first when Chrome scripting permission is available.
- Fall back to NetSuite page XML when scripting is unavailable.
- Open related REST API Browser and Records Catalog links for supported record types.

## Data Sources

The extension tries two read paths:

1. `SuiteScript 2.1`
   Uses a small user-invoked script in the active NetSuite page to call SuiteScript 2.1 APIs and inspect the current record.

2. `Page XML`
   Falls back to NetSuite's `xml=T` page output when scripting is unavailable or blocked.

The active source is shown in the JSON output.

## Privacy

NetSuite Field JSON does not collect, sell, transmit, or store user data.

Record data is read from the active NetSuite tab only after the user opens the extension. The result is displayed locally in the extension popup and is not saved to extension storage, local storage, cookies, or external servers.

The extension does not include analytics, advertising trackers, remote logging, or third-party data services.

Privacy policy:
https://www.technocratconsultinginc.com/NetSuite-Field-JSON-Privacy

## Permissions

The extension uses a small set of Chrome permissions:

- `activeTab`
  Grants temporary access to the active NetSuite tab only after the user clicks the extension.

- `scripting`
  Allows the extension to run a small user-invoked script in the active NetSuite page so SuiteScript 2.1 can read the current record.

- `declarativeContent`
  Enables the extension action only on NetSuite application pages.

## Install Locally

To test as an unpacked Chrome extension:

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Click Load unpacked.
4. Select:

```text
26.5.2_0
```

From this project folder:

```text
src/FileCabinet/TCI/NetSuiteFieldJSON/26.5.2_0
```

## Package

The publishable extension zip is:

```text
src/FileCabinet/TCI/NetSuiteFieldJSON.zip
```

Store screenshots and promotional assets are staged outside the extension package in:

```text
src/FileCabinet/TCI/NetSuiteFieldJSON/store_assets
```

Prepared store assets include:

- `promo_small_440x280.png`
- `screenshot_loaded_popup_1280x800.png`
- `screenshot_filtered_results_1280x800.png`
- `screenshot_fallback_xml_source_1280x800.png`

## Links

- Homepage: https://www.technocratconsultinginc.com/NetSuite-Field-JSON
- Privacy policy: https://www.technocratconsultinginc.com/NetSuite-Field-JSON-Privacy
- Repository: https://github.com/CharlesBastian-TCI/NetSuite_Field_JSON
- Support: Client_Support@TechnocratConsultingInc.com

## Notes

NetSuite is a trademark of Oracle and/or its affiliates. This project is not affiliated with or endorsed by Oracle.

https://buymeacoffee.com/technocrat
