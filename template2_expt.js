/**
 * @fileoverview A sample non-linear VPAID ad useful for testing a VPAID JS
 * enabled player. This ad will show a non-linear ad which can also enter linear
 * mode.
 */

/** @unrestricted */
const VpaidNonLinear = class {
  constructor() {
    this.API_URL = 'https://rinichandra-lf.github.io/test-repo/fonts.json';// Replace with your API endpoint
    this.fonts_ = [
  {
    "format": "truetype",
    "id": 78,
    "styles": [
      {
        "format": "truetype",
        "id": 77,
        "text": "Bold",
        "uid": "nfont-9e177326-97d1-4f4a-99f8-08b4e95ef94d",
        "url": "https://dhi-api.staging.90d.io/fonts/Verdana/verdana-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 78,
        "text": "Regular",
        "uid": "nfont-58997e3e-76b3-42d3-bf47-2d092960a7d5",
        "url": "https://dhi-api.staging.90d.io/fonts/Verdana/verdana.ttf"
      }
    ],
    "text": "Verdana",
    "uid": "nfont-58997e3e-76b3-42d3-bf47-2d092960a7d5",
    "url": "https://dhi-api.staging.90d.io/fonts/Verdana/verdana.ttf"
  },
  {
    "format": "truetype",
    "id": 81,
    "styles": [
      {
        "format": "truetype",
        "id": 81,
        "text": "Regular",
        "uid": "nfont-d00b8a4c-99b7-4781-b36a-018adcbc826c",
        "url": "https://dhi-api.staging.90d.io/fonts/Times New Roman/times.ttf"
      }
    ],
    "text": "Times New Roman",
    "uid": "nfont-d00b8a4c-99b7-4781-b36a-018adcbc826c",
    "url": "https://dhi-api.staging.90d.io/fonts/Times New Roman/times.ttf"
  },
  {
    "format": "truetype",
    "id": 1,
    "styles": [
      {
        "format": "truetype",
        "id": 1,
        "text": "Regular",
        "uid": "nfont-1837e5de-3d3c-4e2c-8c5c-779a56954855",
        "url": "https://dhi-api.staging.90d.io/fonts/Tahoma/tahoma.ttf"
      }
    ],
    "text": "Tahoma",
    "uid": "nfont-1837e5de-3d3c-4e2c-8c5c-779a56954855",
    "url": "https://dhi-api.staging.90d.io/fonts/Tahoma/tahoma.ttf"
  },
  {
    "format": "truetype",
    "id": 13,
    "styles": [
      {
        "format": "truetype",
        "id": 11,
        "text": "Bold",
        "uid": "nfont-2941ba13-d8bd-48a7-8c60-0a0412653e25",
        "url": "https://dhi-api.staging.90d.io/fonts/Rubik/rubik-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 12,
        "text": "Medium",
        "uid": "nfont-1ca655e0-d2cf-4223-81ea-fb0dafd85735",
        "url": "https://dhi-api.staging.90d.io/fonts/Rubik/rubik-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 13,
        "text": "Regular",
        "uid": "nfont-45ac30a6-f561-471a-8a69-2293037d612a",
        "url": "https://dhi-api.staging.90d.io/fonts/Rubik/rubik.ttf"
      },
      {
        "format": "truetype",
        "id": 14,
        "text": "Semi-Bold",
        "uid": "nfont-ae6dd8d4-2a15-4d97-877d-cb5fd7b94002",
        "url": "https://dhi-api.staging.90d.io/fonts/Rubik/rubik-semi_bold.ttf"
      }
    ],
    "text": "Rubik",
    "uid": "nfont-45ac30a6-f561-471a-8a69-2293037d612a",
    "url": "https://dhi-api.staging.90d.io/fonts/Rubik/rubik.ttf"
  },
  {
    "format": "truetype",
    "id": 45,
    "styles": [
      {
        "format": "truetype",
        "id": 43,
        "text": "Bold",
        "uid": "nfont-4a27cc0c-8b7f-4059-b52b-273c8366f3f2",
        "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 44,
        "text": "Thin",
        "uid": "nfont-b3b1d7bc-6f0e-4ed4-acea-22fdeb5c69d0",
        "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 45,
        "text": "Regular",
        "uid": "nfont-d593efd4-4a19-4e1b-95dd-d5ade7573bec",
        "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto.ttf"
      },
      {
        "format": "truetype",
        "id": 46,
        "text": "Medium",
        "uid": "nfont-4991c9e8-a00c-4157-b3b3-99a3cc302874",
        "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 47,
        "text": "Semi-Bold",
        "uid": "nfont-4d8fa7e2-0dfd-44c0-86a5-7f12175c9f39",
        "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto-semi_bold.ttf"
      }
    ],
    "text": "Roboto",
    "uid": "nfont-d593efd4-4a19-4e1b-95dd-d5ade7573bec",
    "url": "https://dhi-api.staging.90d.io/fonts/Roboto/roboto.ttf"
  },
  {
    "format": "truetype",
    "id": 23,
    "styles": [
      {
        "format": "truetype",
        "id": 21,
        "text": "Bold",
        "uid": "nfont-9f5bc28e-b0bc-409d-91e4-f33d2eba860f",
        "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 22,
        "text": "Medium",
        "uid": "nfont-6ac8dbd0-73f7-48ef-85ae-fccaebf0b3a6",
        "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 23,
        "text": "Regular",
        "uid": "nfont-2419f16a-a55b-48f2-a009-2a252bafd1bd",
        "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway.ttf"
      },
      {
        "format": "truetype",
        "id": 24,
        "text": "Thin",
        "uid": "nfont-9343ae69-c4db-4c4f-aef5-cfb8cdc3f359",
        "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 25,
        "text": "Semi-Bold",
        "uid": "nfont-88bf2ec4-bfcd-4b5e-ad8f-e5f7efff27ac",
        "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway-semi_bold.ttf"
      }
    ],
    "text": "Raleway",
    "uid": "nfont-2419f16a-a55b-48f2-a009-2a252bafd1bd",
    "url": "https://dhi-api.staging.90d.io/fonts/Raleway/raleway.ttf"
  },
  {
    "format": "truetype",
    "id": 34,
    "styles": [
      {
        "format": "truetype",
        "id": 31,
        "text": "Bold",
        "uid": "nfont-329fb137-3110-445e-acfa-bd32f043c857",
        "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 32,
        "text": "Medium",
        "uid": "nfont-27d9fd14-80f0-4091-9b51-270582f2b547",
        "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 33,
        "text": "Semi-Bold",
        "uid": "nfont-991274e2-0b4e-4ac9-9225-1787c004413e",
        "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins-semi_bold.ttf"
      },
      {
        "format": "truetype",
        "id": 34,
        "text": "Regular",
        "uid": "nfont-bebffce1-4050-44c8-b33d-2813a23ba61a",
        "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins.ttf"
      },
      {
        "format": "truetype",
        "id": 35,
        "text": "Thin",
        "uid": "nfont-6c925d6a-2004-48a9-a9f1-cc364b305c1e",
        "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins-thin.ttf"
      }
    ],
    "text": "Poppins",
    "uid": "nfont-bebffce1-4050-44c8-b33d-2813a23ba61a",
    "url": "https://dhi-api.staging.90d.io/fonts/Poppins/poppins.ttf"
  },
  {
    "format": "truetype",
    "id": 111,
    "styles": [
      {
        "format": "truetype",
        "id": 112,
        "text": "Medium",
        "uid": "nfont-b6d961f9-c483-422a-b308-b2d8b2f2d6a6",
        "url": "https://dhi-api.staging.90d.io/fonts/Oswald/oswald-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 109,
        "text": "Thin",
        "uid": "nfont-f44a0dd3-28bc-49fe-bf67-ea30efa42f29",
        "url": "https://dhi-api.staging.90d.io/fonts/Oswald/oswald-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 110,
        "text": "Semi-Bold",
        "uid": "nfont-0c749b2d-0863-46b1-bfb3-01c951e8c835",
        "url": "https://dhi-api.staging.90d.io/fonts/Oswald/oswald-semi_bold.ttf"
      },
      {
        "format": "truetype",
        "id": 111,
        "text": "Regular",
        "uid": "nfont-e650ed4c-8908-4333-8364-0fefacb5ca98",
        "url": "https://dhi-api.staging.90d.io/fonts/Oswald/oswald.ttf"
      }
    ],
    "text": "Oswald",
    "uid": "nfont-e650ed4c-8908-4333-8364-0fefacb5ca98",
    "url": "https://dhi-api.staging.90d.io/fonts/Oswald/oswald.ttf"
  },
  {
    "format": "truetype",
    "id": 84,
    "styles": [
      {
        "format": "truetype",
        "id": 83,
        "text": "Bold",
        "uid": "nfont-5e10d86b-d1d8-42ec-9da4-7ce47c6d20b3",
        "url": "https://dhi-api.staging.90d.io/fonts/Open Sans/open-sans-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 84,
        "text": "Regular",
        "uid": "nfont-ef950e4f-bc8b-49c4-9e90-cbb1bf560295",
        "url": "https://dhi-api.staging.90d.io/fonts/Open Sans/open-sans.ttf"
      },
      {
        "format": "truetype",
        "id": 85,
        "text": "Medium",
        "uid": "nfont-d89949fe-56a6-4239-bb72-4fca7bbeb103",
        "url": "https://dhi-api.staging.90d.io/fonts/Open Sans/open-sans-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 86,
        "text": "Semi-Bold",
        "uid": "nfont-c9f45379-3ca2-4ef1-a5f3-e4ae46ede517",
        "url": "https://dhi-api.staging.90d.io/fonts/Open Sans/open-sans-semi_bold.ttf"
      }
    ],
    "text": "Open Sans",
    "uid": "nfont-ef950e4f-bc8b-49c4-9e90-cbb1bf560295",
    "url": "https://dhi-api.staging.90d.io/fonts/Open Sans/open-sans.ttf"
  },
  {
    "format": "truetype",
    "id": 68,
    "styles": [
      {
        "format": "truetype",
        "id": 65,
        "text": "Bold",
        "uid": "nfont-a36f8a59-8a95-4aad-a920-b48af352fc33",
        "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 66,
        "text": "Medium",
        "uid": "nfont-6aeda2c4-06e0-43db-88ed-6465f5ee8f26",
        "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 67,
        "text": "Thin",
        "uid": "nfont-cdc9c1b7-f6ca-4bd5-8345-8935f92f1c1d",
        "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 68,
        "text": "Regular",
        "uid": "nfont-e5fe258c-9dfa-401a-bd56-784cee4ddd2b",
        "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat.ttf"
      },
      {
        "format": "truetype",
        "id": 69,
        "text": "Semi-Bold",
        "uid": "nfont-eedda9bd-4460-43c7-b9f7-ee63ed8469ec",
        "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat-semi_bold.ttf"
      }
    ],
    "text": "Montserrat",
    "uid": "nfont-e5fe258c-9dfa-401a-bd56-784cee4ddd2b",
    "url": "https://dhi-api.staging.90d.io/fonts/Montserrat/montserrat.ttf"
  },
  {
    "format": "truetype",
    "id": 55,
    "styles": [
      {
        "format": "truetype",
        "id": 53,
        "text": "Semi-Bold",
        "uid": "nfont-b38bb98b-28c3-44a2-b4b0-6cc14ad31319",
        "url": "https://dhi-api.staging.90d.io/fonts/Merriweather/merriweather-semi_bold.ttf"
      },
      {
        "format": "truetype",
        "id": 54,
        "text": "Bold",
        "uid": "nfont-4d0945b8-5680-4468-90cc-d4655a9f71e3",
        "url": "https://dhi-api.staging.90d.io/fonts/Merriweather/merriweather-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 55,
        "text": "Regular",
        "uid": "nfont-72c32191-150e-4e1c-bc76-28cb330c704b",
        "url": "https://dhi-api.staging.90d.io/fonts/Merriweather/merriweather.ttf"
      },
      {
        "format": "truetype",
        "id": 56,
        "text": "Medium",
        "uid": "nfont-bf61aa64-9b1d-4055-a9a1-4455e259ca4b",
        "url": "https://dhi-api.staging.90d.io/fonts/Merriweather/merriweather-medium.ttf"
      }
    ],
    "text": "Merriweather",
    "uid": "nfont-72c32191-150e-4e1c-bc76-28cb330c704b",
    "url": "https://dhi-api.staging.90d.io/fonts/Merriweather/merriweather.ttf"
  },
  {
    "format": "truetype",
    "id": 5,
    "styles": [
      {
        "format": "truetype",
        "id": 3,
        "text": "Thin",
        "uid": "nfont-367d9321-fe28-4e2a-bd6e-4b7a05a8741b",
        "url": "https://dhi-api.staging.90d.io/fonts/Lato/lato-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 4,
        "text": "Bold",
        "uid": "nfont-713b943e-0a9c-4f9c-b980-618a0642c6c1",
        "url": "https://dhi-api.staging.90d.io/fonts/Lato/lato-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 5,
        "text": "Regular",
        "uid": "nfont-28ec51f7-362d-4350-b6c2-bd05dc0c3225",
        "url": "https://dhi-api.staging.90d.io/fonts/Lato/lato.ttf"
      }
    ],
    "text": "Lato",
    "uid": "nfont-28ec51f7-362d-4350-b6c2-bd05dc0c3225",
    "url": "https://dhi-api.staging.90d.io/fonts/Lato/lato.ttf"
  },
  {
    "format": "truetype",
    "id": 102,
    "styles": [
      {
        "format": "truetype",
        "id": 102,
        "text": "Regular",
        "uid": "nfont-22e9b11b-85db-43db-a636-243148e4d64b",
        "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter.ttf"
      },
      {
        "format": "truetype",
        "id": 103,
        "text": "Medium",
        "uid": "nfont-5c134007-da22-4e58-b717-a5f440a4c1ec",
        "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 99,
        "text": "Thin",
        "uid": "nfont-434d7ca3-836a-431b-98d3-e90c3596ad89",
        "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 100,
        "text": "Bold",
        "uid": "nfont-7107a5fe-11a6-4b1b-a6cb-b706ee984058",
        "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 101,
        "text": "Semi-Bold",
        "uid": "nfont-038727f3-acd5-4c1f-ab77-291300da0269",
        "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter-semi_bold.ttf"
      }
    ],
    "text": "Inter",
    "uid": "nfont-22e9b11b-85db-43db-a636-243148e4d64b",
    "url": "https://dhi-api.staging.90d.io/fonts/Inter/inter.ttf"
  },
  {
    "format": "truetype",
    "id": 9,
    "styles": [
      {
        "format": "truetype",
        "id": 9,
        "text": "Regular",
        "uid": "nfont-8eb7c6fb-9fe2-4b8b-b0a8-ea3b740d6598",
        "url": "https://dhi-api.staging.90d.io/fonts/Impact/Impact.ttf"
      }
    ],
    "text": "Impact",
    "uid": "nfont-8eb7c6fb-9fe2-4b8b-b0a8-ea3b740d6598",
    "url": "https://dhi-api.staging.90d.io/fonts/Impact/Impact.ttf"
  },
  {
    "format": "truetype",
    "id": 75,
    "styles": [
      {
        "format": "truetype",
        "id": 75,
        "text": "Regular",
        "uid": "nfont-b5386fd5-7c4f-442e-8904-02b7a2cdb8a0",
        "url": "https://dhi-api.staging.90d.io/fonts/Helvetica/Helvetica.ttf"
      }
    ],
    "text": "Helvetica",
    "uid": "nfont-b5386fd5-7c4f-442e-8904-02b7a2cdb8a0",
    "url": "https://dhi-api.staging.90d.io/fonts/Helvetica/Helvetica.ttf"
  },
  {
    "format": "truetype",
    "id": 127,
    "styles": [
      {
        "format": "truetype",
        "id": 124,
        "text": "Semi-Bold",
        "uid": "nfont-e0764731-5343-4c44-9f7a-ca286a3944a2",
        "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian-semi_bold.ttf"
      },
      {
        "format": "truetype",
        "id": 127,
        "text": "Regular",
        "uid": "nfont-11698c17-f1be-43db-ab69-cd98d4241b67",
        "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian.ttf"
      },
      {
        "format": "truetype",
        "id": 125,
        "text": "Medium",
        "uid": "nfont-39978368-5d63-4bb2-be1d-7f858fe3e5a7",
        "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 126,
        "text": "Thin",
        "uid": "nfont-529e2bf3-ce7b-4d43-a423-552ba675737b",
        "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian-thin.ttf"
      },
      {
        "format": "truetype",
        "id": 123,
        "text": "Bold",
        "uid": "nfont-404d04e1-a852-4854-9a2d-8624ff0ae990",
        "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian-bold.ttf"
      }
    ],
    "text": "Georgian",
    "uid": "nfont-11698c17-f1be-43db-ab69-cd98d4241b67",
    "url": "https://dhi-api.staging.90d.io/fonts/Georgian/georgian.ttf"
  },
  {
    "format": "truetype",
    "id": 92,
    "styles": [
      {
        "format": "truetype",
        "id": 91,
        "text": "Semi-Bold",
        "uid": "nfont-e00212e2-1214-4e17-920e-539876abd42d",
        "url": "https://dhi-api.staging.90d.io/fonts/Garamond/garamond-semi_bold.ttf"
      },
      {
        "format": "truetype",
        "id": 92,
        "text": "Regular",
        "uid": "nfont-837e7691-ebc9-4c3f-aa83-e9378e00c1f4",
        "url": "https://dhi-api.staging.90d.io/fonts/Garamond/garamond.ttf"
      },
      {
        "format": "truetype",
        "id": 93,
        "text": "Bold",
        "uid": "nfont-2b1ce0ca-6e8e-4ca3-91ce-463720881143",
        "url": "https://dhi-api.staging.90d.io/fonts/Garamond/garamond-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 94,
        "text": "Medium",
        "uid": "nfont-33fb5342-b8ca-4483-b8aa-6b5c4ebfc648",
        "url": "https://dhi-api.staging.90d.io/fonts/Garamond/garamond-medium.ttf"
      }
    ],
    "text": "Garamond",
    "uid": "nfont-837e7691-ebc9-4c3f-aa83-e9378e00c1f4",
    "url": "https://dhi-api.staging.90d.io/fonts/Garamond/garamond.ttf"
  },
  {
    "format": "truetype",
    "id": 19,
    "styles": [
      {
        "format": "truetype",
        "id": 19,
        "text": "Regular",
        "uid": "nfont-7947701b-a002-4e70-ab6c-950ab53a553c",
        "url": "https://dhi-api.staging.90d.io/fonts/Futura/Futura.ttf"
      }
    ],
    "text": "Futura",
    "uid": "nfont-7947701b-a002-4e70-ab6c-950ab53a553c",
    "url": "https://dhi-api.staging.90d.io/fonts/Futura/Futura.ttf"
  },
  {
    "format": "truetype",
    "id": 62,
    "styles": [
      {
        "format": "truetype",
        "id": 61,
        "text": "Bold",
        "uid": "nfont-a5512b8a-11e6-4266-a9c6-9eea07121b3f",
        "url": "https://dhi-api.staging.90d.io/fonts/Courier New/Courier_New -bold.ttf"
      },
      {
        "format": "truetype",
        "id": 62,
        "text": "Regular",
        "uid": "nfont-738fd492-3e94-4c27-a7b9-7253e668d252",
        "url": "https://dhi-api.staging.90d.io/fonts/Courier New/Courier_New.ttf"
      }
    ],
    "text": "Courier New",
    "uid": "nfont-738fd492-3e94-4c27-a7b9-7253e668d252",
    "url": "https://dhi-api.staging.90d.io/fonts/Courier New/Courier_New.ttf"
  },
  {
    "format": "truetype",
    "id": 41,
    "styles": [
      {
        "format": "truetype",
        "id": 41,
        "text": "Regular",
        "uid": "nfont-6242d7b7-1c60-4959-b887-5e69d4a805f9",
        "url": "https://dhi-api.staging.90d.io/fonts/Bebas Neue/BebasNeue.ttf"
      }
    ],
    "text": "Bebas Neue",
    "uid": "nfont-6242d7b7-1c60-4959-b887-5e69d4a805f9",
    "url": "https://dhi-api.staging.90d.io/fonts/Bebas Neue/BebasNeue.ttf"
  },
  {
    "format": "truetype",
    "id": 117,
    "styles": [
      {
        "format": "truetype",
        "id": 118,
        "text": "Bold",
        "uid": "nfont-36e274a3-aedd-4340-9464-6fddfb18c02e",
        "url": "https://dhi-api.staging.90d.io/fonts/Arial/ARIAL-bold.ttf"
      },
      {
        "format": "truetype",
        "id": 119,
        "text": "Medium",
        "uid": "nfont-445b61eb-23f5-4fdb-a85d-ef9793f1541d",
        "url": "https://dhi-api.staging.90d.io/fonts/Arial/Arial-medium.ttf"
      },
      {
        "format": "truetype",
        "id": 117,
        "text": "Regular",
        "uid": "nfont-91a43525-d825-40aa-bd81-51f705a993d9",
        "url": "https://dhi-api.staging.90d.io/fonts/Arial/ARIAL.ttf"
      }
    ],
    "text": "Arial",
    "uid": "nfont-91a43525-d825-40aa-bd81-51f705a993d9",
    "url": "https://dhi-api.staging.90d.io/fonts/Arial/ARIAL.ttf"
  }
];
    /**
     * The slot is the div element on the main page that the ad is supposed to
     * occupy.
     * @private {Object}
     */
    this.slot_ = null;

    /**
     * The video slot is the video element used by the ad to render video
     * content.
     * @private {Object}
     */
    this.videoSlot_ = null;

    /**
     * An object containing all registered events. These events are all
     * callbacks for use by the VPAID ad.
     * @private {Object}
     */
    this.eventsCallbacks_ = {};

    /**
     * Current index of the displayed overlay image
     * @private {number}
     */
    this.currentOverlayIndex_ = 0;

    /**
     * Interval ID for the image carousel
     * @private {number}
     */
    this.carouselInterval_ = null;
    this.overlayImages_ = [];
    this.overlayTexts_ = [];

    /**
     * Timeout for starting the carousel
     * @private {number}
     */
    this.carouselStartTimeout_ = null;

    /**
     * Timeout for ending the carousel
     * @private {number}
     */
    this.carouselEndTimeout_ = null;

    /**
     * A list of getable and setable attributes.
     * @private {Object}
     */
    this.attributes_ = {
      companions: "",
      desiredBitrate: 256,
      duration: 10,
      expanded: false,
      height: 0,
      icons: "",
      linear: false,
      viewMode: "normal",
      width: 0,
      volume: 1.0,
      countdownTime: 10, // The countdown duration in seconds.
      currentTime: 0, // Current time of the countdown.
      linear: false, // Linear ad state.
      skippableState: true, // Skippable state of the ad.
      volume: 1.0, // Volume of the ad.
      carouselInterval: 5000, // Transition every x seconds by default
      carouselStartDelay: 4000, // Start carousel after 4 seconds
      carouselEndEarly: 4, // End carousel x seconds before ad ends
    };

    /**
     * When the ad was started.
     * @private {number}
     */
    this.startTime_ = 0;

    /**
     * A set of ad playback events to be reported.
     * @private {Object}
     */
    this.quartileEvents_ = [
      { event: "AdImpression", value: 0 },
      { event: "AdVideoStart", value: 0 },
      { event: "AdVideoFirstQuartile", value: 25 },
      { event: "AdVideoMidpoint", value: 50 },
      { event: "AdVideoThirdQuartile", value: 75 },
      { event: "AdVideoComplete", value: 100 },
    ];

    /**
     * @private {number} An index into what quartile was last reported.
     */
    this.nextQuartileIndex_ = 0;

    /**
     * Parameters passed in from the AdParameters section of the VAST.
     * Used for video URL and MIME type.
     * @private {!Object}
     */
    this.parameters_ = {};

    this.skipOffsetSeconds_ = 0;

    this.scale_ = 1;

    //frontend preview sizing
    this.baseWidth_ = 800;
    this.baseHeight_ = 450;

    this.defaults_ = {
      addressBackgroundColor: "#FF0000",
      addressColor: "white",
      addressFontSize: 14,
      addressFontStyle: "normal",
      addressFont: "sans-serif",
      address: " ",
      websiteBackgroundColor: "#CC0000",
      websiteColor: "white",
      websiteFontSize: 14,
      websiteFontStyle: "bold",
      websiteFont: "sans-serif",
      website: " ",
      productDetailsFontColor: "black",
      productDetailsFontSize: 14,
      productDetailsFont: "sans-serif",
      productDetailsFontStyle: "bold",
      productNameColor: "black",
      productNameFontSize: 16,
      productNameFontStyle: "bold",
      productNameFont: "sans-serif",
      priceFontColor: "black",
      priceFontSize: 28,
      priceFontStyle: "bold",
      priceFont: "sans-serif",
    };
  }

loadFonts_() {
    this.log('Loading Google Fonts via CDN');
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&family=Bebas+Neue&family=Courier+New:wght@400;700&family=Montserrat:wght@100;400;500;600;700&family=EB+Garamond:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@100;400;500;600;700&family=Helvetica&family=Impact&family=Inter:wght@100;400;500;600;700&family=Lato:wght@100;400;700&family=Merriweather:wght@400;500;600;700&family=Montserrat:wght@100;400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@100;400;500;600&family=Poppins:wght@100;400;500;600;700&family=Raleway:wght@100;400;500;600;700&family=Roboto:wght@100;400;500;600;700&family=Rubik:wght@400;500;600;700&family=Tahoma&family=Times+New+Roman&family=Verdana:wght@400;700&display=swap');
    `;
    if (this.slot_) {
      this.slot_.appendChild(styleEl);
      this.log('Font styles appended to slot');
    } else {
      document.head.appendChild(styleEl);
      this.log('Font styles appended to document.head');
    }
    document.fonts.ready.then(() => {
      this.log('Fonts loaded, triggering reflow');
      this.overlayTexts_.forEach(text => {
        text.style.opacity = '1';
        text.style.fontFamily = text.style.fontFamily;
      });
    });
  }

  getFontWeight_(style) {
    const weights = {
      'Thin': '100',
      'Regular': '400',
      'Medium': '500',
      'Semi-Bold': '600',
      'Bold': '700'
    };
    return weights[style] || '400';
  }

  getFallbackFont_(font) {
    const serifFonts = ['EB Garamond', 'Merriweather', 'Times New Roman'];
    const sansFonts = ['Arial', 'Helvetica', 'Inter', 'Lato', 'Montserrat', 'Open Sans', 'Poppins', 'Raleway', 'Roboto', 'Rubik', 'Tahoma', 'Verdana', 'Noto Sans Georgian'];
    const displayFonts = ['Bebas Neue', 'Impact', 'Oswald'];
    if (font === 'Futura') return 'Montserrat, Helvetica, sans-serif';
    if (serifFonts.includes(font)) return `${font}, Times New Roman, Georgia, serif`;
    if (displayFonts.includes(font)) return `${font}, Impact, sans-serif`;
    if (font === 'Courier New') return `${font}, monospace`;
    return `${font}, Arial, Helvetica, sans-serif`;
  }

  /**
   * Returns the supported VPAID verion.
   * @param {string} version
   * @return {string}
   */
  handshakeVersion(version) {
    return "2.0";
  }

  /**
   * Initializes all attributes in the ad. The ad will not start until startAd
   * is called.
   * @param {number} width The ad width.
   * @param {number} height The ad height.
   * @param {string} viewMode The ad view mode.
   * @param {number} desiredBitrate The chosen bitrate.
   * @param {Object} creativeData Data associated with the creative.
   * @param {Object} environmentVars Runtime variables associated with the
   *     creative like the slot and video slot.
   */
  initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.attributes_["desiredBitrate"] = desiredBitrate;

    // slot and videoSlot are passed as part of the environmentVars
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;

    // Parse the incoming ad parameters.
    this.parameters_ = JSON.parse(creativeData["AdParameters"]);

    this.skipOffsetSeconds_ = this.parameters_.skipOffset;

    // NEW: Fetch and load fonts
    //await this.fetchFonts_();
    this.loadFonts_();

    this.scaleX_ = width / this.baseWidth_;
    this.scaleY_ = height / this.baseHeight_;
    this.scale_ = Math.min(this.scaleX_, this.scaleY_);
    console.log("scaling factor: ", this.scale_);

    this.log("skip offset: ", this.skipOffsetSeconds_);

    this.log("initAd " + width + "x" + height + " " + viewMode + " " + desiredBitrate);
    this.callEvent_("AdLoaded");
  }

  /**
   * Helper function to update the size of the video player.
   * @private
   */
  updateVideoPlayerSize_() {
    this.videoSlot_.setAttribute("width", this.attributes_["width"]);
    this.videoSlot_.setAttribute("height", this.attributes_["height"]);
  }

  scalePx(val) {
    return (val * this.scale_).toFixed(2) + 'px';
  }

  /**
   * Called by the wrapper to start the ad.
   */
  startAd = function () {
    this.log("Starting ad");

    const date = new Date();
    this.startTime_ = date.getTime();

    // Create a div to contain our ad elements.
    const overlays = this.parameters_.overlays || [];

    const container = document.createElement("div");
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.right = "0%";
    this.slot_.appendChild(container);

    // Create image container for carousel - positioned on the right side
    const imageContainer = document.createElement("div");
    imageContainer.id = "overlayContainer";
    imageContainer.style.display = "none"; // Initially hidden until delay time
    imageContainer.style.position = "absolute";
    imageContainer.style.right = "4%";
    imageContainer.style.top = "5.5%";
    imageContainer.style.height = "76%"; // Reduced to make room for bottom banner
    imageContainer.style.width = "28%";
    imageContainer.style.overflow = "hidden";
    container.appendChild(imageContainer);

    // Create bottom strip with two parts
    const bottomStripContainer = document.createElement("div");
    bottomStripContainer.id = "bottomStripContainer";
    bottomStripContainer.style.display = "none";
    bottomStripContainer.style.position = "absolute";
    bottomStripContainer.style.bottom = "0";
    bottomStripContainer.style.width = "100%";
    bottomStripContainer.style.height = "9%";
    container.appendChild(bottomStripContainer);

    // Left part - address container
    const leftStrip = document.createElement("div");
    leftStrip.style.backgroundColor = this.parameters_.addressBackgroundColor || this.defaults_.addressBackgroundColor; // Standard red
    leftStrip.style.flex = "1";
    leftStrip.style.display = "flex";
    leftStrip.style.justifyContent = "center";
    leftStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(leftStrip);

    // address text
    const address = document.createElement("div");
    address.style.color = this.parameters_.addressColor || this.defaults_.addressColor;
    address.style.padding = `0 ${this.scalePx(8)}`;
    address.style.fontSize = this.scalePx(this.parameters_.addressFontSize) || this.scalePx(this.defaults_.addressFontSize);
    address.style.fontWeight = this.getFontWeight_(this.parameters_.addressFontStyle || this.defaults_.addressFontStyle);    address.style.letterSpacing = this.scalePx(1);
    address.style.fontFamily = this.parameters_.addressFont || this.defaults_.addressFont;
    address.textContent = this.parameters_.address || this.defaults_.address;
    leftStrip.appendChild(address);

    // Right part - website URL container
    const rightStrip = document.createElement("div");
    rightStrip.style.backgroundColor = this.parameters_.websiteBackgroundColor || this.defaults_.websiteBackgroundColor; // Standard red
    rightStrip.style.flex = "0 0 34%";
    rightStrip.style.display = "flex";
    rightStrip.style.justifyContent = "center";
    rightStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(rightStrip);

    // website URL text
    const websiteURL = document.createElement("div");
    websiteURL.style.color = this.parameters_.websiteColor || this.defaults_.websiteColor;
    websiteURL.style.padding = `0 ${this.scalePx(8)}`;
    websiteURL.style.fontSize = this.scalePx(this.parameters_.websiteFontSize) || this.scalePx(this.defaults_.websiteFontSize);
    websiteURL.style.fontWeight = this.getFontWeight_(this.parameters_.websiteFontStyle || this.defaults_.websiteFontStyle);
    websiteURL.style.letterSpacing = this.scalePx(1);
    websiteURL.style.fontFamily = this.parameters_.websiteFont || this.defaults_.websiteFont;
    websiteURL.textContent = this.parameters_.website || this.defaults_.website;
    rightStrip.appendChild(websiteURL);

    // Logo image container (above red strip)
    const logoContainer = document.createElement("div");
    logoContainer.id = "logoContainer";
    logoContainer.style.display = "none";
    logoContainer.style.position = "absolute";
    logoContainer.style.bottom = "15.5%";
    logoContainer.style.left = "1.875%"; //24px for 1280px width, 12px for 640px width
    logoContainer.style.width = "60%";
    logoContainer.style.height = "14%";
    logoContainer.style.justifyContent = "start";
    container.appendChild(logoContainer);

    // Logo image
    const logoImg = document.createElement("img");
    logoImg.src = this.parameters_.bottomImageUrl || overlays[0]?.imageUrl || overlays[0];
    logoImg.style.height = "100%";
    logoImg.style.maxWidth = "100%";
    logoImg.style.objectFit = "contain";
    logoContainer.appendChild(logoImg);

    // Add CSS animation styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
          
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .slide-out-right {
          animation: slideOutRight 0.5s forwards;
        }
        
        .slide-in-from-top {
          animation: slideInFromTop 0.5s forwards;
        }
        
        .fade-in {
          animation: fadeIn 0.5s forwards;
        }
        
        .overlay-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin: auto;
          width: 100%;
          height: 100%;
        }
        
        .overlay-text {
          text-align: center;
          width: 100%;
          white-space: pre-line;
        }
      `;
    document.head.appendChild(styleEl);

    // Create and setup overlay units (image + text)
    this.overlayImages_ = overlays.map((overlay, index) => {
      // Create a container for the image and text as a unit
      const overlayUnit = document.createElement("div");
      overlayUnit.className = "overlay-unit";
      overlayUnit.style.display = "none"; // All start hidden

      // Create image element
      const img = document.createElement("img");
      img.src = overlay.imageUrl || overlay;
      img.style.width = "100%";
      img.style.maxHeight = "60%";
      img.style.objectFit = "contain";

      // Create text element
      const nameElement = document.createElement("h3");
      nameElement.style.margin = "0";
      nameElement.style.textAlign = "center";
      nameElement.style.color = overlay.productNameColor || this.defaults_.productNameColor;
      nameElement.style.fontFamily = overlay.productNameFont || this.defaults_.productNameFont;
      nameElement.style.fontSize = overlay.productNameFontSize
        ? this.scalePx(overlay.productNameFontSize)
        : this.scalePx(this.defaults_.productNameFontSize);
      nameElement.style.fontWeight = this.getFontWeight_(overlay.productNameFontStyle || this.defaults_.productNameFontStyle);
      nameElement.textContent = overlay.productName || " ";
      this.overlayTexts_.push(nameElement);

      const productDescriptionElement = document.createElement("div");
      productDescriptionElement.className = "overlay-text";
      productDescriptionElement.style.color = overlay.productDetailsFontColor || this.defaults_.productDetailsFontColor;
      productDescriptionElement.style.fontFamily = overlay.productDetailsFont;
      productDescriptionElement.style.fontSize = overlay.productDetailsFontSize ? this.scalePx(overlay.productDetailsFontSize) : this.scalePx(this.defaults_.productDetailsFontSize);
      productDescriptionElement.style.fontWeight = this.getFontWeight_(overlay.productDetailsFontStyle || this.defaults_.productDetailsFontStyle)
      productDescriptionElement.textContent = overlay.productDescription || " ";
      this.overlayTexts_.push(productDescriptionElement);

      const priceElement = document.createElement("div");
      priceElement.style.color = overlay.priceFontColor || this.defaults_.priceFontColor;
      priceElement.style.fontFamily = overlay.priceFont || this.defaults_.priceFont;
      priceElement.style.fontSize = overlay.priceFontSize ? this.scalePx(overlay.priceFontSize) : this.scalePx(this.defaults_.priceFontSize);
      priceElement.style.fontWeight = this.getFontWeight_(overlay.priceFontStyle || this.defaults_.priceFontStyle);
      priceElement.textContent = overlay.price || " ";
      this.overlayTexts_.push(priceElement);

      // Add click handler to the unit
      overlayUnit.addEventListener(
        "click",
        () => {
          this.adClick_(overlay.clickThrough);
        },
        false
      );

      // Append image and text to the unit
      overlayUnit.appendChild(nameElement);
      overlayUnit.appendChild(img);
      overlayUnit.appendChild(productDescriptionElement);
      overlayUnit.appendChild(priceElement);

      // Add to container
      imageContainer.appendChild(overlayUnit);

      return overlayUnit;
    });

    container.addEventListener("click", (e) => {
      const isProductClick = e.target.closest(".overlay-unit");
      const isSkipButton = e.target.closest("#skipButton");
      if (!isProductClick && !isSkipButton && this.parameters_.defaultClickThrough) {
        window.open(this.parameters_.defaultClickThrough, "_blank");
      }
    });

    // Start the video
    const videos = this.parameters_.videos || [];
    for (let i = 0; i < videos.length; i++) {
      if (this.videoSlot_.canPlayType(videos[i].mimetype) != "") {
        this.videoSlot_.setAttribute("src", videos[i].url);

        this.videoSlot_.addEventListener("timeupdate", this.timeUpdateHandler_.bind(this), false);
        this.videoSlot_.addEventListener("loadedmetadata", this.loadedMetadata_.bind(this), false);
        this.videoSlot_.addEventListener("ended", this.stopAd.bind(this), false);

        this.videoSlot_.play();
        break;
      }
    }

    this.callEvent_("AdStarted");
    this.callEvent_("AdImpression");

    // Schedule the start of carousel after the delay
    this.carouselStartTimeout_ = setTimeout(() => {
      const overlayContainer = document.getElementById("overlayContainer");
      const logoContainer = document.getElementById("logoContainer");
      const bottomStripContainer = document.getElementById("bottomStripContainer");
      if (overlayContainer && logoContainer && bottomStripContainer) {
        // Show containers first
        overlayContainer.style.display = "block";
        logoContainer.style.display = "flex";
        bottomStripContainer.style.display = "flex";

        // Add animation class to the first overlay with a slight delay
        setTimeout(() => {
          if (this.overlayImages_.length > 0) {
            const firstUnit = this.overlayImages_[0];
            firstUnit.style.display = "flex";
            firstUnit.classList.add("slide-in-from-top");

            // Remove animation class after animation completes
            setTimeout(() => {
              firstUnit.classList.remove("slide-in-from-top");
            }, 500);
          }

          // Setup carousel interval if multiple images exist
          if (this.overlayImages_.length > 1) {
            this.carouselInterval_ = setInterval(() => {
              this.updateOverlayImage_();
            }, this.parameters_["carouselInterval"] * 1000);
          }
        }, 50); // Small delay to ensure container is visible first
      }
    }, this.parameters_["carouselStartDelay"] * 1000 || this.attributes_["carouselStartDelay"]);

    // Create a Skip Ad button
    if (this.parameters_["isSkippable"]) {
      this.skipButtonTimeout_ = setTimeout(() => {
        const skipButton = document.createElement("button");
        skipButton.id = "skipButton";
        skipButton.textContent = "Skip Ad";
        skipButton.style.fontSize = this.scalePx(12);
        skipButton.style.position = "absolute";
        skipButton.style.bottom = "8.83%";
        skipButton.style.right = "1.38%";
        skipButton.style.padding = `${this.scalePx(5)} ${this.scalePx(10)}`;
        skipButton.style.backgroundColor = "#cccccc";
        skipButton.style.color = "#fff";
        skipButton.style.border = `${this.scalePx(2)} solid white`;
        skipButton.style.borderRadius = `${this.scalePx(5)}`;
        skipButton.style.cursor = "pointer";
        skipButton.style.zIndex = "1000";

        skipButton.addEventListener("click", () => {
          this.log("Ad skipped by user");
          clearInterval(this.countdownInterval_);
          this.callEvent_("AdSkipped");
          this.stopAd();
        });

        container.appendChild(skipButton);
      }, this.skipOffsetSeconds_ * 1000); // Respect skipOffset
    }
  };

  /**
   * Updates the currently displayed overlay image with slide animations
   * @private
   */
  updateOverlayImage_() {
    if (!this.overlayImages_ || this.overlayImages_.length <= 1) return;

    // Get current and next image unit
    const currentUnit = this.overlayImages_[this.currentOverlayIndex_];
    const nextIndex = (this.currentOverlayIndex_ + 1) % this.overlayImages_.length;
    const nextUnit = this.overlayImages_[nextIndex];

    // Add slide-out animation class to current unit
    currentUnit.classList.add("slide-out-right");

    // After animation completes, hide current and show next with animation
    setTimeout(() => {
      // Hide current unit and remove animation class
      currentUnit.style.display = "none";
      currentUnit.classList.remove("slide-out-right");

      // Show next unit with slide-in animation
      nextUnit.style.display = "flex";
      nextUnit.classList.add("slide-in-from-top");

      // Update index
      this.currentOverlayIndex_ = nextIndex;

      // Remove animation class after animation completes
      setTimeout(() => {
        nextUnit.classList.remove("slide-in-from-top");
      }, 500);
    }, 500);
  }

  /**
   * Called when an overlay image is clicked with its specific URL.
   * @param {string} clickThrough The URL to navigate to (optional)
   * @private
   */
  adClick_(clickThrough) {
    if ("AdClickThru" in this.eventsCallbacks_) {
      // If specific URL provided, use it, otherwise use default
      const url = clickThrough || "";
      this.eventsCallbacks_["AdClickThru"](url, "0", true);
    }
  }

  /**
   * Called by the video element when video metadata is loaded.
   * @private
   */
  loadedMetadata_() {
    // The ad duration is not known until the media metadata is loaded.
    // Then, update the player with the duration change.
    this.attributes_["duration"] = this.videoSlot_.duration;
    this.callEvent_("AdDurationChange");
    if (this.parameters_["carouselEnd"]) {
      this.attributes_["carouselEndEarly"] = this.parameters_["carouselEnd"];
    }

    // Schedule the end of carousel 5 seconds before the end of the video
    if (this.videoSlot_.duration > this.attributes_["carouselEndEarly"]) {
      const endTime = (this.videoSlot_.duration - this.attributes_["carouselEndEarly"]) * 1000;
      this.carouselEndTimeout_ = setTimeout(() => {
        if (this.carouselInterval_) {
          clearInterval(this.carouselInterval_);
          this.carouselInterval_ = null;
        }

        const overlayContainer = document.getElementById("overlayContainer");
        const logoContainer = document.getElementById("logoContainer");
        const bottomStripContainer = document.getElementById("bottomStripContainer");
        if (overlayContainer && logoContainer && bottomStripContainer) {
          overlayContainer.style.display = "none";
          logoContainer.style.display = "none";
          bottomStripContainer.style.display = "none";
        }
      }, endTime);
    }
  }

  /**
   * Called by the video element when the video reaches specific points during
   * playback.
   * @private
   */
  timeUpdateHandler_() {
    if (this.nextQuartileIndex_ >= this.quartileEvents_.length) {
      return;
    }
    const percentPlayed = (this.videoSlot_.currentTime * 100.0) / this.videoSlot_.duration;
    let nextQuartile = this.quartileEvents_[this.nextQuartileIndex_];
    if (percentPlayed >= nextQuartile.value) {
      this.eventsCallbacks_[nextQuartile.event]();
      this.nextQuartileIndex_ += 1;
    }
    if (this.videoSlot_.duration > 0) {
      this.attributes_["remainingTime"] = this.videoSlot_.duration - this.videoSlot_.currentTime;
    }
  }

  /**
   * Called by the wrapper to stop the ad.
   */
  stopAd() {
    this.log("Stopping ad");

    // Clear all timers
    if (this.carouselInterval_) {
      clearInterval(this.carouselInterval_);
    }

    if (this.carouselStartTimeout_) {
      clearTimeout(this.carouselStartTimeout_);
    }

    if (this.carouselEndTimeout_) {
      clearTimeout(this.carouselEndTimeout_);
    }

    this.callEvent_("AdStopped");
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through.
    const callback = this.callEvent_.bind(this);
    setTimeout(callback, 75, ["AdStopped"]);
  }

  /**
   * Called when the video player changes the width/height of the container.
   * @param {number} width The new width.
   * @param {number} height A new height.
   * @param {string} viewMode A new view mode.
   */
  resizeAd(width, height, viewMode) {
    this.log("resizeAd " + width + "x" + height + " " + viewMode);
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.updateVideoPlayerSize_();
    this.callEvent_("AdSizeChange");
  }

  /**
   * Pauses the ad.
   */
  pauseAd() {
    this.log('pauseAd');
    this.videoSlot_.pause();
    // Pause the carousel
    if (this.carouselInterval_) {
      clearInterval(this.carouselInterval_);
      this.carouselInterval_ = null;
    }
    this.callEvent_('AdPaused');
  }
  /**
   * Resumes the ad.
   */
  resumeAd() {
    this.log('resumeAd');
    this.videoSlot_.play();
    // Resume the carousel
    if (!this.carouselInterval_ && this.overlayImages_.length > 1) {
      this.carouselInterval_ = setInterval(() => {
        this.updateOverlayImage_();
      }, this.parameters_['carouselInterval'] * 1000);
    }
    this.callEvent_('AdPlaying');
  }

  /**
   * Expands the ad.
   */
  expandAd() {
    this.log("expandAd");
    this.attributes_["expanded"] = true;
    this.callEvent_("AdExpanded");
  }

  /**
   * Collapses the ad.
   */
  collapseAd() {
    this.log("collapseAd");
    this.attributes_["expanded"] = false;
  }

  /**
   * Skips the ad.
   */
  skipAd() {
    this.log("skipAd");
    if (this.attributes_["skippableState"]) {
      this.callEvent_("AdSkipped");
    }
  }

  /**
   * Registers a callback for an event.
   * @param {Function} callback The callback function.
   * @param {string} eventName The callback type.
   * @param {Object} context The context for the callback.
   */
  subscribe(callback, eventName, context) {
    this.log("Subscribe " + eventName);
    this.eventsCallbacks_[eventName] = callback.bind(context);
  }

  /**
   * Removes a callback based on the eventName.
   * @param {string} eventName The callback type.
   */
  unsubscribe(eventName) {
    this.log("unsubscribe " + eventName);
    this.eventsCallbacks_[eventName] = null;
  }

  /**
   * Returns whether the ad is linear.
   * @return {boolean} True if the ad is a linear, false for non linear.
   */
  getAdLinear() {
    return this.attributes_["linear"];
  }

  /**
   * Returns ad width.
   * @return {number} The ad width.
   */
  getAdWidth() {
    return this.attributes_["width"];
  }

  /**
   * Returns ad height.
   * @return {number} The ad height.
   */
  getAdHeight() {
    return this.attributes_["height"];
  }

  /**
   * Returns true if the ad is expanded.
   * @return {boolean}
   */
  getAdExpanded() {
    this.log("getAdExpanded");
    return this.attributes_["expanded"];
  }

  /**
   * Returns the skippable state of the ad.
   * @return {boolean}
   */
  getAdSkippableState() {
    this.log("getAdSkippableState");
    return this.attributes_["skippableState"];
  }

  /**
   * Returns the remaining ad time, in seconds.
   * @return {number} The time remaining in the ad.
   */
  getAdRemainingTime() {
    return this.attributes_["remainingTime"];
  }

  /**
   * Returns the duration of the ad, in seconds.
   * @return {number} The duration of the ad.
   */
  getAdDuration() {
    return this.attributes_["duration"];
  }

  /**
   * Returns the ad volume.
   * @return {number} The volume of the ad.
   */
  getAdVolume() {
    this.log("getAdVolume");
    return this.attributes_["volume"];
  }

  /**
   * Sets the ad volume.
   * @param {number} value The volume in percentage.
   */
  setAdVolume(value) {
    this.attributes_["volume"] = value;
    this.log("setAdVolume " + value);
    this.callEvent_("AdVolumeChange");
  }

  /**
   * Returns a list of companion ads for the ad.
   * @return {string} List of companions in VAST XML.
   */
  getAdCompanions() {
    return this.attributes_["companions"];
  }

  /**
   * Returns a list of icons.
   * @return {string} A list of icons.
   */
  getAdIcons() {
    return this.attributes_["icons"];
  }

  /**
   * Logs events and messages.
   * @param {string} message
   */
  log(message) {
    console.log(message);
  }

  /**
   * Calls an event if there is a callback.
   * @param {string} eventType
   * @private
   */
  callEvent_(eventType) {
    if (eventType in this.eventsCallbacks_) {
      this.eventsCallbacks_[eventType]();
    }
  }
};

/**
 * Main function called by wrapper to get the VPAID ad.
 * @return {Object} The VPAID compliant ad.
 */
var getVPAIDAd = function () {
  return new VpaidNonLinear();
};
