import { BNSS_FORM_1 } from "./bnss-1";
import { BNSS_FORM_2 } from "./bnss-2";
import { BNSS_FORM_3 } from "./bnss-3";
import { BNSS_FORM_4 } from "./bnss-4";
import { BNSS_FORM_5 } from "./bnss-5";
import { BNSS_FORM_6 } from "./bnss-6";
import { BNSS_FORM_7 } from "./bnss-7";
import { BNSS_FORM_8 } from "./bnss-8";
import { BNSS_FORM_9 } from "./bnss-9";
import { BNSS_FORM_10 } from "./bnss-10";
import { BNSS_FORM_11 } from "./bnss-11";
import { BNSS_FORM_12 } from "./bnss-12";
import { BNSS_FORM_13 } from "./bnss-13";
import { BNSS_FORM_14 } from "./bnss-14";
import { BNSS_FORM_15 } from "./bnss-15";
import { BNSS_FORM_16 } from "./bnss-16";
import { BNSS_FORM_17 } from "./bnss-17";
import { BNSS_FORM_18 } from "./bnss-18";
import { BNSS_FORM_19 } from "./bnss-19";
import { BNSS_FORM_20 } from "./bnss-20";
import { BNSS_FORM_21 } from "./bnss-21";
import { BNSS_FORM_22 } from "./bnss-22";
import { BNSS_FORM_23 } from "./bnss-23";
import { BNSS_FORM_24 } from "./bnss-24";
import { BNSS_FORM_25 } from "./bnss-25";
import { BNSS_FORM_26 } from "./bnss-26";
import { BNSS_FORM_27 } from "./bnss-27";
import { BNSS_FORM_28 } from "./bnss-28";
import { BNSS_FORM_29 } from "./bnss-29";
import { BNSS_FORM_30 } from "./bnss-30";
import { BNSS_FORM_31 } from "./bnss-31";
import { BNSS_FORM_32 } from "./bnss-32";
import { BNSS_FORM_33 } from "./bnss-33";
import { BNSS_FORM_34 } from "./bnss-34";
import { BNSS_FORM_35 } from "./bnss-35";
import { BNSS_FORM_36 } from "./bnss-36";
import { BNSS_FORM_37 } from "./bnss-37";
import { BNSS_FORM_38 } from "./bnss-38";
import { BNSS_FORM_39 } from "./bnss-39";
import { BNSS_FORM_40 } from "./bnss-40";
import { BNSS_FORM_41 } from "./bnss-41";
import { BNSS_FORM_42 } from "./bnss-42";
import { BNSS_FORM_43 } from "./bnss-43";
import { BNSS_FORM_44 } from "./bnss-44";
import { BNSS_FORM_45 } from "./bnss-45";
import { BNSS_FORM_46 } from "./bnss-46";
import { BNSS_FORM_47 } from "./bnss-47";
import { BNSS_FORM_48 } from "./bnss-48";
import { BNSS_FORM_49 } from "./bnss-49";
import { BNSS_FORM_50 } from "./bnss-50";
import { BNSS_FORM_51 } from "./bnss-51";
import { BNSS_FORM_52 } from "./bnss-52";
import { BNSS_FORM_53 } from "./bnss-53";
import { BNSS_FORM_54 } from "./bnss-54";
import { BNSS_FORM_55 } from "./bnss-55";
import { BNSS_FORM_56 } from "./bnss-56";

import { FormDefinition } from "../schema";

export const AVAILABLE_FORMS: FormDefinition[] = [
  BNSS_FORM_1,
  BNSS_FORM_2,
  BNSS_FORM_3,
  BNSS_FORM_4,
  BNSS_FORM_5,
  BNSS_FORM_6,
  BNSS_FORM_7,
  BNSS_FORM_8,
  BNSS_FORM_9,
  BNSS_FORM_10,
  BNSS_FORM_11,
  BNSS_FORM_12,
  BNSS_FORM_13,
  BNSS_FORM_14,
  BNSS_FORM_15,
  BNSS_FORM_16,
  BNSS_FORM_17,
  BNSS_FORM_18,
  BNSS_FORM_19,
  BNSS_FORM_20,
  BNSS_FORM_21,
  BNSS_FORM_22,
  BNSS_FORM_23,
  BNSS_FORM_24,
  BNSS_FORM_25,
  BNSS_FORM_26,
  BNSS_FORM_27,
  BNSS_FORM_28,
  BNSS_FORM_29,
  BNSS_FORM_30,
  BNSS_FORM_31,
  BNSS_FORM_32,
  BNSS_FORM_33,
  BNSS_FORM_34,
  BNSS_FORM_35,
  BNSS_FORM_36,
  BNSS_FORM_37,
  BNSS_FORM_38,
  BNSS_FORM_39,
  BNSS_FORM_40,
  BNSS_FORM_41,
  BNSS_FORM_42,
  BNSS_FORM_43,
  BNSS_FORM_44,
  BNSS_FORM_45,
  BNSS_FORM_46,
  BNSS_FORM_47,
  BNSS_FORM_48,
  BNSS_FORM_49,
  BNSS_FORM_50,
  BNSS_FORM_51,
  BNSS_FORM_52,
  BNSS_FORM_53,
  BNSS_FORM_54,
  BNSS_FORM_55,
  BNSS_FORM_56,
];

// Helper to get form by ID
export function getFormById(id: string): FormDefinition | undefined {
  return AVAILABLE_FORMS.find((form) => form.id === id);
}
