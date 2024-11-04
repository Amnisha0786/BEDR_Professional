export const regex_name = /^[a-z\s-]{1,}[A-Z\s-]$|^[A-Z\s-]{1,}[a-z\s-]$/i;
export const regex_last_name =
  /^[a-z\s-]{1,}[A-Z\s-]*$|^[A-Z\s-]{1,}[a-z\s-]*$/i;
export const regex_password =
  /^(?=.*[!@#$%^&-?£])(?=.*[0-9])(?=.*[A-Z])[!@#$%^&0-9A-Za-z-?£]{8,}$/;
export const regex_optional_name = /^[a-z\s-][A-Z\s-]*$|^[A-Z\s-][a-z\s-]*$/i;
export const regex_practice_address = /^[a-zA-Z0-9\s,.'-]*$/;
export const regex_practice_username = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{4,}$/;
export const regex_unique_numbers = /^[a-zA-Z0-9]{4,20}$/i;
export const regex_goc_number = /^D-\d{4,5}$/gm;
export const regex_post_code = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d ]{5,8}$/gm;
export const regex_gmc_number = /^\d{7}$/gm;
export const regex_ico_number = /^[A-Z]{2}\d{6}$/;
