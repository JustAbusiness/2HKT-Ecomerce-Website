import axios, { AxiosError } from "axios";
import HttpStatusCode from "src/constants/httpStatusCode.enum";
import userImage from "../../../2hktshop/src/assets/react.svg"

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error);
}

export function isAxiosUnprocessableEntityError<FormError>(
  error: unknown
): error is AxiosError<FormError> {
  return (
    isAxiosError(error) &&
    error.response?.status === HttpStatusCode.UnprocessableEntity
  );
}

// CHUYỂN ĐỔI TIỀN TỆ
export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("de-DE").format(currency);
}

export function formatNumberToSocialStyle(value: number) {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2
  })
    .format(value)
    .replace(".", ",").toLowerCase()
}

// TÍNH GIẢM GIÁ
export const rateSale = (original: number, sale:number) => Math.round(((original - sale) / original) * 100 ) + "%";


// XỬ LÝ URL THÂN THIỆN SEO

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')

export const generateNameId = ({ name, id }: { name: string; id: string }) => {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i_${id}`
}

export const getIdFromNameId = (nameId: string) => {
  const arr = nameId.split('-i_')
  return arr[arr.length - 1]
}


// GET URL UPLOAD AVATAR
export const getAvatarURL = (avatarName?: string) => avatarName ? `https://api-ecom.duthanhduoc.com/images/${avatarName}` : userImage