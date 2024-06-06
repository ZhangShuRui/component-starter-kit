import jsCookie from 'js-cookie'
import { getInstance, NATIVE_EVENT, WEB_EVENT } from './BrowserMessenger'
import {
  AppConfigType,
  ChooseDocumentResult,
  LocationType,
  OpenAlbumResult,
  OpenCameraResult,
} from './types'
import { UserType } from './types'

const messenger = getInstance()

export enum MediaTypeOptions {
  All = 'All',
  Videos = 'Videos',
  Images = 'Images',
}

export const DOC_EXTS = Object.freeze({
  allFiles: '*',
  audio:
    '.3g2 .3gp .aac .adt .adts .aif .aifc .aiff .asf .au .m3u .m4a .m4b .mid .midi .mp2 .mp3 .mp4 .rmi .snd .wav .wax .wma',
  csv: '.csv',
  doc: '.doc',
  docx: '.docx',
  images: '.jpeg .jpg .png',
  pdf: '.pdf',
  plainText: '.txt',
  ppt: '.ppt',
  pptx: '.pptx',
  video: '.mp4',
  xls: '.xls',
  xlsx: '.xlsx',
  zip: '.zip .gz',
} as const)

export enum MIME_TYPES {
  ALL_FILES = 'allFiles',
  AUDIO = 'audio',
  CSV = 'csv',
  DOC = 'doc',
  DOCX = 'docx',
  IMAGES = 'images',
  PDF = 'pdf',
  PLAIN_TEXT = 'plainText',
  PPT = 'ppt',
  PPTX = 'pptx',
  VIDEO = 'video',
  XLS = 'xls',
  XLSX = 'xlsx',
  ZIP = 'zip',
}

const _sendNativeRequest = (
  webEvtName: string,
  nativeEvtName: string | null,
  data?: any,
  enableTimer?: boolean
) => {
  let timer: NodeJS.Timeout
  return new Promise(resolve => {
    if (timer) clearTimeout(cameraTimer)
    if (enableTimer) {
      timer = setTimeout(() => {
        resolve(null)
      }, 10000)
    }
    const removeEvent = messenger.addEvent(
      nativeEvtName as any,
      (data: any) => {
        if (timer) clearTimeout(timer)
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: webEvtName,
      data,
    })
  })
}

export const previewPdf = (url: string): void => {
  messenger.postMessage({
    type: WEB_EVENT.PREVIEW_PDF,
    data: url,
  })
}

export const notifyTokenExpired = (callbackUrl?: string): void => {
  messenger.postMessage({
    type: WEB_EVENT.TOKEN_EXPIRED,
    data: {
      callback: callbackUrl,
    },
  })
}

export const saveToAlbum = (
  uri: string,
  options?: {
    filename?: string
    ext?: string
    agent?: boolean
  }
): Promise<void> => {
  return _sendNativeRequest(
    WEB_EVENT.SAVE_TO_ALBUM,
    NATIVE_EVENT.SAVED_TO_ALBUM,
    {
      uri,
      options,
    }
  ) as any
}

export const dial = async (number: string): Promise<void> => {
  return (await _sendNativeRequest(WEB_EVENT.DIAL, null, number)) as any
}

export const email = async (number: string): Promise<void> => {
  return (await _sendNativeRequest(WEB_EVENT.EMAIL, null, number)) as any
}

export const download = async (
  uri: string,
  options?: {
    filename?: string
    ext?: string
    agent?: boolean
  }
): Promise<void> => {
  return (await _sendNativeRequest(
    WEB_EVENT.DOWNLOAD,
    NATIVE_EVENT.DOWNLOAD_COMPLETED,
    {
      uri,
      options,
    }
  )) as any
}

let docTimer: NodeJS.Timeout
export const chooseDocument = (
  type?: MIME_TYPES
): Promise<ChooseDocumentResult> => {
  return new Promise(resolve => {
    if (docTimer) clearTimeout(docTimer)
    docTimer = setTimeout(() => {
      resolve(null as any)
    }, 10000)
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.UPLOAD_DATA_READY,
      (data: any) => {
        clearTimeout(docTimer)
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.OPEN_DOCUMENT,
      data: type || MIME_TYPES.ALL_FILES,
    })
  })
}

export const openAlbum = (
  mediaTypes?: MediaTypeOptions
): Promise<OpenAlbumResult> => {
  return new Promise(resolve => {
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.UPLOAD_DATA_READY,
      (data: any) => {
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.OPEN_ALBUM,
      data: mediaTypes || MediaTypeOptions.All,
    })
  })
}

let cameraTimer: string | number | NodeJS.Timeout | undefined
export const openCamera = (
  mediaTypes?: MediaTypeOptions
): Promise<OpenCameraResult> => {
  return new Promise(resolve => {
    if (cameraTimer) clearTimeout(cameraTimer)
    cameraTimer = setTimeout(() => {
      resolve(null as any)
    }, 10000)
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.UPLOAD_DATA_READY,
      (data: any) => {
        clearTimeout(cameraTimer)
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.OPEN_CAMERA,
      data: mediaTypes || MediaTypeOptions.All,
    })
  })
}

let locationTimer: any
export const requestLocation = (): Promise<LocationType> => {
  return new Promise(resolve => {
    if (locationTimer) clearTimeout(locationTimer)
    locationTimer = setTimeout(() => {
      resolve(null as any)
    }, 10000)
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.LOCATION,
      (data: any) => {
        if (data) {
          clearTimeout(locationTimer)
          resolve(data)
        }
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.REQUEST_LOCATION,
    })
  })
}

let scanTimer: any
export const requestScan = (options?: {
  userDefined: true
}): Promise<{
  url: string
}> => {
  return new Promise(resolve => {
    if (scanTimer) clearTimeout(scanTimer)
    scanTimer = setTimeout(() => {
      resolve(null as any)
    }, 10000)
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.GET_SCAN_RESULT,
      (data: any) => {
        clearTimeout(scanTimer)
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.REQUEST_SCAN,
      data: options,
    })
  })
}

export const showNavBar = () => {
  messenger.postMessage({
    type: WEB_EVENT.SHOW_NAVBAR,
  })
}

export const hideNavBar = () => {
  messenger.postMessage({
    type: WEB_EVENT.HIDE_NAVBAR,
  })
}

export const closeWindow = () => {
  messenger.postMessage({
    type: WEB_EVENT.CLOSE_WINDOW,
  })
}

export const openLink = (href: string) => {
  messenger.postMessage({
    type: WEB_EVENT.OPEN_LINK,
    data: href,
  })
}

export const setPageTitle = (title: string) => {
  messenger.postMessage({
    type: WEB_EVENT.SET_TITLE,
    data: title,
  })
}

let currUserTimer: any
export const getCurrentUser = (): Promise<UserType> => {
  return new Promise(resolve => {
    if (currUserTimer) clearTimeout(currUserTimer)
    currUserTimer = setTimeout(() => {
      resolve(null as any)
    }, 10000)
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.GET_CURRENT_USER,
      (data: any) => {
        clearTimeout(currUserTimer)
        jsCookie.set('user', JSON.stringify(data))
        resolve(data)
        removeEvent()
      }
    )
    messenger.postMessage({
      type: WEB_EVENT.REQUEST_CURRENT_USER,
    })
  })
}

export const getAppConfig = (): Promise<AppConfigType> => {
  let appConfig: any
  return new Promise(resolve => {
    const removeEvent = messenger.addEvent(
      NATIVE_EVENT.GET_APP_CONFIG,
      (data: any) => {
        if (data) {
          try {
            window.localStorage.setItem('appConfig', JSON.stringify(data))
            appConfig = data
          } catch (e) {}
        }
        resolve(appConfig)
        removeEvent()
      }
    )

    messenger.postMessage({
      type: WEB_EVENT.REQUEST_APP_CONFIG,
    })
  })
}
